#!/bin/bash

startBlock="${1}"   #1 represent 1st argument
endBlock="${2}"     #2 represent 2st argument


for (( i=startBlock; i<=endBlock; i++ ))
do 
        ./toCurl.sh getblock $i | jq .tx[]
done


