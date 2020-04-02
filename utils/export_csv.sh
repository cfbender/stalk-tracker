#!/bin/bash
source ../.env
echo "Connecting to MongoDB...."
[[ $MONGODB_URI =~ mongodb://(.*):.*@ ]]
username=${BASH_REMATCH[1]}
[[ $MONGODB_URI =~ mongodb://.*:(.*)@ ]]
password=${BASH_REMATCH[1]}

target="../stalk_data.csv"
mongoexport -h ds335678.mlab.com:35678 -d heroku_394gz2vg -c prices -u $username -p $password -o $target --type=csv -f _id,price,user,timing,date

echo "Exported to $target"