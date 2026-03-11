#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument



#time ./listTXs.sh $startBlock $endBlock | xargs -n1 ./txDetails.sh | jq .vout.[].n | wc -l 

t=$(./listTXs.sh $startBlock $endBlock | xargs -n1 ./txDetails.sh | jq -r '.vout | length' | paste -sd+ | bc)
o=$(./listTXs.sh $startBlock $endBlock | xargs -n1 ./txDetails.sh | jq .orchard | jq -r '.actions | length' | paste -sd+ | bc)
s=$(./listTXs.sh $startBlock $endBlock | xargs -n1 ./txDetails.sh | jq -r ' .vShieldedOutput | length ' | paste -sd+ | bc)

result=$(echo "$t + $o + $s" | bc)

echo "$result transfer transactions"
