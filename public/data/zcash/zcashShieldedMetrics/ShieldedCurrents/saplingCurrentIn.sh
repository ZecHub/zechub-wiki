#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument

zero="0"

mapfile -t myResult < <(./findTXsByTypeII.sh $startBlock $endBlock Sapling) # | sed 's/\x1B\[[0-9;]\{1,\}[A-Za-z]//g')

length=${#myResult[@]}
i=0
mySum=0

if [ -f myResultsInS.md ]; then
    rm myResultsInS.md
fi

echo "------------------"

while [[ i -lt length ]]
do
	check=$(echo ${myResult[$i]} | awk '{ print $22}')
	if (( $(echo "$check < $zero" |bc -l) )); then
		echo ${myResult[$i]} >> myResultsInS.md
	fi
        i=$(( $i + 1 ))
done

cat myResultsInS.md | column -t

if [ -f dataInS.md ]; then
    rm dataInS.md
fi

if [ -f myResultsInS.md ]; then
    cat myResultsInS.md | awk '{ print $22}' >> dataInS.md
    mySum=$(cat myResultsInS.md | awk '{ print $22}' | paste -sd+ | bc)
fi

echo "------------------"
echo
echo "Total ZEC moved into the Sapling Pool: $mySum"