#!/bin/bash

daoAddress="${1}"   #1 represent 1st argument

now=$(date +%c)


config=$(curl -s -X GET "https://indexer.daodao.zone/juno-1/contract/"$daoAddress"/daoCore/config")

jq '.' <<< "${config[@]}" > mydao.json

proposalCount=$(curl -s -X GET "https://indexer.daodao.zone/juno-1/contract/"$daoAddress"/daoCore/proposalCount")

jq '.' <<< "${proposalCount[@]}" > propcount.json

memberCount=$(curl -s -X GET "https://indexer.daodao.zone/juno-1/contract/"$daoAddress"/daoCore/memberCount")

jq '.' <<< "${memberCount[@]}" > membercount.json

daoProps=$(curl -s -X GET "https://indexer.daodao.zone/juno-1/contract/"$daoAddress"/daoCore/allProposals?recursive=true")

jq '.' <<< "${daoProps[@]}" > daoProps.json

daoName=$(jq '.name' mydao.json)
daoDescription=$(jq -r '.description' mydao.json)
daoPropCount=$(jq '.' propcount.json)
daoMembers=$(jq '.' membercount.json)

echo
echo "As of $now", "The contract address provided has the following details:"
echo
echo "Name: $daoName"
echo "-----------------------------------------"
echo "Description: $daoDescription"
echo
echo "Number of Members:      $memberCount"
echo "Number of Propositions: $daoPropCount"
echo "------------------------------------------"
echo

echo "$daoName propositions json written: \"daoProps.json\""
echo

