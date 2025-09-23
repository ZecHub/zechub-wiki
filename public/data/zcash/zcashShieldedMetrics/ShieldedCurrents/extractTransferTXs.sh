#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument

#./listTXs.sh $startBlock $endBlock > mytxids

t=$(cat mytxids | xargs -n1 ./txDetails.sh | jq -r '.vout | length' | paste -sd+ | bc)
o=$(cat mytxids | xargs -n1 ./txDetails.sh | jq .orchard | jq -r '.actions | length' | paste -sd+ | bc)
s=$(cat mytxids | xargs -n1 ./txDetails.sh | jq -r ' .vShieldedOutput | length ' | paste -sd+ | bc)

result=$(echo "$t + $o + $s" | bc)

echo "$t t transfer txs"
echo "$s s transfer txs"
echo "$o o transfer txs"
echo "$result"
