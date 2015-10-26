#!/bin/bash
kill `cat run.pid`
npm run build
go build
nohup ./go-react-seed > logs/app.log 2>&1&
echo $! > run.pid
