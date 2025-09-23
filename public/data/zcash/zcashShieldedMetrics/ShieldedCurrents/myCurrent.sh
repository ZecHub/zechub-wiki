#!/bin/bash

numOfBlocks="${1}"
#startBlock="${1}"   #1 represent 1st argument
#endBlock="${2}"     #2 represent 2st argument

if [ -f myresults.md ]; then
    rm myresults.md
fi


if [ -f summaryOnly.md ]; then
	rm summaryOnly.md
fi

tip=$(./getBlockCount.sh)
startBlock=$(( $tip - $numOfBlocks ))
endBlock=$tip

if [ -f mytxids ]; then
	rm mytxids
fi

./transparentCurrent.sh $startBlock $endBlock | tee -a myresults.md

echo | tee -a myresults.md

./saplingCurrent.sh $startBlock $endBlock | tee -a myresults.md

echo | tee -a myresults.md

./orchardCurrent.sh $startBlock $endBlock | tee -a myresults.md

echo "================================================================================"
cat summaryOnly.md
echo


#echo "Extracting net flow ..."
#echo
#./updateFlow.sh
