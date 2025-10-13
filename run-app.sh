apiPort=3001
clientPort=4200
curdir="$(echo $(pwd))"
client="$(echo $curdir/client)"
api="$(echo $curdir/planets-api)"
kill $(lsof -t -i:$clientPort) 2> /dev/null
wait $(lsof -t -i:$clientPort) 2> /dev/null
kill $(lsof -t -i:$apiPort) 2> /dev/null
wait $(lsof -t -i:$apiPort) 2> /dev/null
cd $api && npm start &
cd $client && ng serve &