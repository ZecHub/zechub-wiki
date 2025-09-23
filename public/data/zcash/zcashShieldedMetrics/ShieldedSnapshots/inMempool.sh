#!/bin/bash

txID="${1}"   #1 represent 1st argument


# Determine if txID is in the mempool

result=0
size=($(./toCurl.sh getrawmempool | jq -r 'length'))


a=($(./toCurl.sh getrawmempool))
a=("${a[@]}")


while [[ "$size" -ge 1 ]]
	do
 
		tx=$(echo ${a[size]} | tr -d ',' | tr -d '"')

		if [[ "$tx" == "$txID" ]];
		then
			result=1
		        echo $result 
		fi

		size=$(( $size - 1 ))
done


if [[ "$result" == "0" ]];
then
	echo 0
fi
