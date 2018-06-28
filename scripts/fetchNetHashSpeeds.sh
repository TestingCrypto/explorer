#! /bin/bash

BLOCKID=`/usr/local/bin/Firecoin-cli getblockcount`
NETSPEED=`/usr/local/bin/Firecoin-cli getnetworkhashps 100 $BLOCKID`

echo -n "var hashData = ["
for x in $(seq 100 100 $BLOCKID); do 
  SPEED=`/usr/local/bin/Firecoin-cli getnetworkhashps 100 $x`
  echo -n "[$x,$SPEED],"
done
echo "[$BLOCKID,$NETSPEED]]"
