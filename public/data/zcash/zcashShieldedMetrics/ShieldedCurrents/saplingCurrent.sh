#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument

#txNum=$(./countTXs.sh $startBlock $endBlock | paste -sd+ | bc)

txNum=$(cat mytxids | wc -l)


echo "================================================================================"
echo "extracting Sapling IN-flows ..."
echo

./saplingCurrentIn.sh $startBlock $endBlock

echo
echo "extracting Sapling OUT-flows ..."
echo

./saplingCurrentOut.sh $startBlock $endBlock

numOfINtxs=0
numOfOUTtxs=0
mySumIn=0
mySumOut=0

if [ -f myResultsInS.md ]; then
    numOfINtxs=$(cat myResultsInS.md | wc -l)
    mySumIn=$(cat myResultsInS.md | awk '{ print $18}' | paste -sd+ | bc)
fi

if [ -f myResultsOutS.md ]; then
    numOfOUTtxs=$(cat myResultsOutS.md | wc -l)
    mySumOut=$(cat myResultsOutS.md | awk '{ print $18}' | paste -sd+ | bc)
fi


saplingTXs=$(( $numOfINtxs + $numOfOUTtxs ))

sRatio=$(echo "scale=2; ($saplingTXs / $txNum) * 100" | bc )

echo "-----------"
echo
echo "Between blocks $startBlock and $endBlock, there were $txNum transactions."
echo "Of these, "
echo
echo "S txs in  : $numOfINtxs" | tee -a summaryOnly.md
echo "S txs out : $numOfOUTtxs" | tee -a summaryOnly.md
echo "S txs     : $saplingTXs ( $sRatio % )" | tee -a summaryOnly.md
echo "S Inflows : $mySumIn ZEC" | tee -a summaryOnly.md
echo "S Outflows: $mySumOut ZEC" | tee -a summaryOnly.md
echo "S flow => : $(echo "$mySumIn + $mySumOut" | bc ) ZEC" | tee -a summaryOnly.md

temp=$(echo "scale=2; $mySumIn + $mySumOut" | bc )

echo ${temp%%.*} > rawSaplingFlow.md