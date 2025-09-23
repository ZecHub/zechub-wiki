#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument

zero="0"

mapfile -t myResult < <(./findTXsByTypeII.sh $startBlock $endBlock Orchard) #| sed 's/\x1B\[[0-9;]\{1,\}[A-Za-z]//g')

length=${#myResult[@]}
i=0
mySum=0

if [ -f myResultsInO.md ]; then
    rm myResultsInO.md
fi

echo "------------------"

while [[ i -lt length ]]
do
	check=$(echo ${myResult[$i]} | awk '{ print $24}')
	if (( $(echo "$check < $zero" |bc -l) )); then
		echo ${myResult[$i]} >> myResultsInO.md
	fi
        i=$(( $i + 1 ))
done

cat myResultsInO.md | column -t

if [ -f dataInO.md ]; then
    rm dataInO.md
fi

if [ -f myResultsInO.md ]; then
    cat myResultsInO.md | awk '{ print $24}' >> dataInO.md #18 = total, 22 = sapling, 24 = orchard
    mySum=$(cat myResultsInO.md | awk '{ print $24}' | paste -sd+ | bc)
fi

echo "------------------"
echo
echo "Total ZEC moved into the Orchard Pool: $mySum"

