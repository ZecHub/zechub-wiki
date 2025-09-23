#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument

zero="0"

mapfile -t myResult < <(./findTXsByTypeII.sh $startBlock $endBlock Sapling) #| sed 's/\x1B\[[0-9;]\{1,\}[A-Za-z]//g')

length=${#myResult[@]}
i=0
mySum=0

if [ -f myResultsOutS.md ]; then
    rm myResultsOutS.md
fi

echo "------------------"

while [[ i -lt length ]]
do
	check=$(echo ${myResult[$i]} | awk '{ print $22}')
	if (( $(echo "$check > $zero" |bc -l) )); then
		echo ${myResult[$i]} >> myResultsOutS.md
	fi
        i=$(( $i + 1 ))
done

cat myResultsOutS.md | column -t

if [ -f dataOutS.md ]; then
    rm dataOutS.md
fi

if [ -f myResultsOutS.md ]; then
    cat myResultsOutS.md | awk '{ print $22}' >> dataOutS.md
    mySum=$(cat myResultsOutS.md | awk '{ print $22}' | paste -sd+ | bc)
fi

echo "------------------"
echo
echo "Total ZEC moved out of the Sapling Pool: $mySum"