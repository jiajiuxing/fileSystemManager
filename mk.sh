#!/bin/bash

for i in {1..5};do
    for j in {10..15};do
	for k in {20..25};do
	    mkdir -p $i/$j/$k
	    for n in {30..35};do
		touch $i/$j/$k/$n
	    done
	done
    done
done    
