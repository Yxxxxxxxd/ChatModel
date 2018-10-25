#!/bin/bash
echo "Start Running"
nohup npm start >con.out 2>&1 &
echo "Launched"
