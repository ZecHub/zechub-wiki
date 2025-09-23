#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument

zero="0"


sDate=$(./getDateFromBlock.sh $startBlock)
eDate=$(./getDateFromBlock.sh $endBlock)
blockNum=$(echo "$endBlock - $startBlock" | bc)

echo "Between [$startBlock],[$endBlock]" | tee -a summaryOnly.md
echo "================================================================================" | tee -a myresults.md
echo "Finding TXs ..." | tee -a myresults.md
echo | tee -a myresults.md



mapfile -t myResult < <(./findTXsByTypeII.sh $startBlock $endBlock Transparent) # | LC_ALL=C grep -v ',' | sed 's/\x1B\[[0-9;]\{1,\}[A-Za-z]//g')

length=${#myResult[@]}
i=0


if [ -f myResultsOutT.md ]; then
    rm myResultsOutT.md
fi

echo "------------------"

while [[ i -lt length ]]
do
	check=$(echo ${myResult[$i]} | awk '{ print $20}')
	if (( $(echo "$check > $zero" |bc -l) )); then
		echo ${myResult[$i]} >> myResultsOutT.md
	fi
        i=$(( $i + 1 ))
done

cat myResultsOutT.md | column -t

if [ -f dataOutT.md ]; then
    rm dataOutT.md
fi

cat myResultsOutT.md | awk '{ print $20}' >> dataOutT.md

mySum=$(cat myResultsOutT.md | awk '{ print $20}' | paste -sd+ | bc)

#txNum=$(./countTXs.sh $startBlock $endBlock | paste -sd+ | bc)

txNumCoinbase=$(cat myResultsOutT.md | grep -c IsCoinbase)
txNum=$(cat mytxids | wc -l)
Ratio=$(echo "scale=2; 100-(($length / $txNum) * 100)" | bc )

CoinbaseRatio=$(echo "scale=2; 100-(($txNumCoinbase / $txNum) * 100)" | bc )

transferTXs=$(./extractTransferTXs.sh $startBlock $endBlock)

echo
echo "$txNum txs" | tee -a summaryOnly.md
echo "$txNumCoinbase coinbase txs (=> $CoinbaseRatio% Coinbase txs)" | tee -a summaryOnly.md
echo "$transferTXs total transfer txs" | tee -a summaryOnly.md
echo "T txs  : $length (=> $Ratio% Shielded)" | tee -a summaryOnly.md

