#! /bin/bash

TOTBLOCKS=`/usr/local/bin/Firecoin-cli getblockcount`
CBLOCKH=`/usr/local/bin/Firecoin-cli getblockhash $TOTBLOCKS`
CBLOCKD=`/usr/local/bin/Firecoin-cli getblock $CBLOCKH | grep diff | awk '{print $3}' | tr -d ','`

echo -n "var diffData = ["
for x in $(seq 100 100 $TOTBLOCKS); do 
  BLOCKH=`/usr/local/bin/Firecoin-cli getblockhash $x`
  BLOCKD=`/usr/local/bin/Firecoin-cli getblock $BLOCKH | grep diff | awk '{print $3}' | tr -d ','`
  echo -n "[$x,$BLOCKD],"
done

echo "[$TOTBLOCKS,$CBLOCKD]]"
