#!/bin/bash

txID="${1}"    #1 represent 1st argument

rawTx=$(./toCurl.sh getrawtransaction $txID 1)

echo $rawTx | jq



