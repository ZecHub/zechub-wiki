#!/bin/bash

block="${1}"   #1 represent 1st argument

now=$(./toCurl.sh getblock $block | jq .time)

# Divide the difference by 3600 to calculate hours/ 60 for minutes
#answer=$(bc <<< "scale=2 ; $now/1")0

testTime=$(date -d @$now +%c)

echo $testTime
