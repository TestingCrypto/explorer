var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , settings = require('../lib/settings')
  , request = require('request')
  , RPCClient = require('../lib/rpcclient');

function exit() {
  mongoose.disconnect();
  process.exit(0);
}

// LOCAL MONGO DB
var dbString = 'mongodb://' + settings.dbsettings.user;
dbString = dbString + ':' + settings.dbsettings.password;
dbString = dbString + '@' + settings.dbsettings.address;
dbString = dbString + ':' + settings.dbsettings.port;
dbString = dbString + '/' + settings.dbsettings.database;

// check options
if (process.argv.length <4) {
    console.log('syntax: peers hostname username password');
    process.exit(0);
}

var config = { host: process.argv[2], user: process.argv[3], password: process.argv[4]};

var client = new RPCClient(config);
mongoose.connect(dbString, grabPeers(client));

function grabPeers( vRPCClient, err) {
  if (err) {
    console.log('Unable to connect to database: %s', dbString);
    console.log('Aborting');
    exit();
  } else {
    client.call({ method:'getpeerinfo', params:[], id:'rpcExample', jsonrpc:'2.0'
     },(err, res)=>{
      if(err){
         console.log('Unable to connect to remote node: %s, %s',vRPCClient.host,err);
         console.log('Aborting....');
         exit();
      } else {
       //console.log(res.result);//Json parsed.
       lib.syncLoop(res.result.length, function (loop) {
        var i = loop.iteration();
        var address = res.result[i].addr.split(':')[0];

        //console.log('checking peer %s',address);
        db.find_peer(address, function(peer) {
          if (peer && res.result[i].version > 200000) {
            // peer already exists
            console.log('Checking peer, %s %s %s', address, res.result[i].version, res.result[i].subver.replace('/', '').replace('/', ''));
            loop.next();
          } else {
            request({uri: 'http://freegeoip.net/json/' + address, json: true}, function (error, response, geo) {
            console.log('Detected peer, %s %s %s %s %s', address, res.result[i].version, res.result[i].subver.replace('/', '').replace('/', '') , geo.country_name, geo.country_code); 
              db.create_peer({
                address: address,
                protocol: res.result[i].version,
                version: res.result[i].subver.replace('/', '').replace('/', ''),
                country: geo.country_name,
		countrycode: geo.country_code
              }, function(){
                loop.next();
              }); // create peer
            }); // request geoip
          }
        }); // find peer
      }, function() { exit(); });  // lib loop
     }
    }, function() { 
         exit(); 
    }); // client call
  } // else
} // grab peers
