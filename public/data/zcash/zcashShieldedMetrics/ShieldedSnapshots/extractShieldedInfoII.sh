#!/bin/bash

date=$(./toCurl.sh getblockcount | xargs ./getDateFromBlock.sh)
date=$(date -d "$date" +'%x')

myResult=$(./getDailySnapShot.sh 1152)


#echo -e "$myResult"

sproutCount=$(echo -e "$myResult" | LC_ALL=C fgrep -c Sprout)
saplingCount=$(echo -e "$myResult" | LC_ALL=C fgrep -c Sapling)
orchardCount=$(echo -e "$myResult" | LC_ALL=C fgrep -c Orchard)

shieldedCount=$((("$sproutCount + $saplingCount + $orchardCount" )))

echo $date $shieldedCount $sproutCount $saplingCount $orchardCount >> DailyShieldedDataII.md

cat DailyShieldedDataII.md 
