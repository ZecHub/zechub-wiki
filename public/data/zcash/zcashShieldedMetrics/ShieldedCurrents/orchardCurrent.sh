#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument

#txNum=$(./countTXs.sh $startBlock $endBlock | paste -sd+ | bc)

txNum=$(cat mytxids | wc -l)

echo "================================================================================"
echo "extracting Orchard IN-flows ..."
echo

./orchardCurrentIn.sh $startBlock $endBlock

echo
echo "extracting Orchard OUT-flows ..."
echo

./orchardCurrentOut.sh $startBlock $endBlock

numOfINtxs=0
numOfOUTtxs=0
mySumIn=0
mySumOut=0

if [ -f myResultsInO.md ]; then
    numOfINtxs=$(cat myResultsInO.md | wc -l)
    mySumIn=$(cat myResultsInO.md | awk '{ print $18}' | paste -sd+ | bc)
fi

if [ -f myResultsOutO.md ]; then
    numOfOUTtxs=$(cat myResultsOutO.md | wc -l)
    mySumOut=$(cat myResultsOutO.md | awk '{ print $18}' | paste -sd+ | bc)
fi


orchardTXs=$(( $numOfINtxs + $numOfOUTtxs ))

oRatio=$(echo "scale=2; ($orchardTXs / $txNum) * 100" | bc )

echo "-----------"
echo
echo "Between blocks $startBlock and $endBlock, there were $txNum transactions."
echo "Of these, "
echo
echo "O txs in  : $numOfINtxs " | tee -a summaryOnly.md
echo "O txs out : $numOfOUTtxs" | tee -a summaryOnly.md
echo "O txs     : $orchardTXs ( $oRatio % )" | tee -a summaryOnly.md
echo "O Inflows : $mySumIn ZEC" | tee -a summaryOnly.md
echo "O Outflows: $mySumOut ZEC" | tee -a summaryOnly.md
echo "O flow => : $(echo "$mySumIn + $mySumOut" | bc ) ZEC" | tee -a summaryOnly.md
echo | tee -a summaryOnly.md
./extractSupplyInfo.sh | tee -a summaryOnly.md
echo "\_-ZECHUB-_/" | tee -a summaryOnly.md

temp=$(echo "scale=2; $mySumIn + $mySumOut" | bc )

echo ${temp%%.*} > rawOrchardFlow.md