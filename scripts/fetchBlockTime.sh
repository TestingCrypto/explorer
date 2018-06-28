#! /bin/bash

TOTBLOCKS=`/usr/local/bin/Firecoin-cli getblockcount`
CBLOCKH=`/usr/local/bin/Firecoin-cli getblockhash $TOTBLOCKS`
CBLOCKD=`/usr/local/bin/Firecoin-cli getblock $CBLOCKH | grep time | awk '{print $3}' | tr -d ','`

GENESIS="1403927609"

echo -n "var timeData = ["
for x in $(seq 500 500 $TOTBLOCKS); do 
  BLOCKH=`/usr/local/bin/Firecoin-cli getblockhash $x`
  BLOCKD=`/usr/local/bin/Firecoin-cli getblock $BLOCKH | grep time | awk '{print $3}' | tr -d ','`

  BLOCKDIFF=$(( $BLOCKD - $GENESIS ))
  GENESIS=$BLOCKD
  
  echo -n "[$x,$BLOCKDIFF],"
done

BLOCKDIFF=$(( $CBLOCKD - $GENESIS ))
echo "[$TOTBLOCKS,0]]"
