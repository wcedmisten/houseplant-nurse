#!/bin/bash

cd client && yarn build && cd .. && go run main.go
