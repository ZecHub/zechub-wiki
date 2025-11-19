#!/bin/bash

block="${1}"
debug="${2}"

if [[ "$debug" == "true" ]];then
	
	./listBlockTXs.sh $block | xargs -n1 ./tx_type.sh | awk '{ print $11,$15}'
else
	
	./listBlockTXs.sh $block | xargs -n1 ./getTXfeeII.sh | awk '{ print $1}' | paste -sd+ | bc
fi