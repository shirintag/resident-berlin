# Resident Berlin

Resident Berlin curates local events and displays them on a map. Built with Node.js, Express.js,
React, Google Map API and Facebook API.

## Setup
#### node packages
```npm install```
#### mongodb  
```
brew update
brew install mongodb
mkdir -p /data/db

# create db and import test data
mongoimport --jsonArray --db resident-berlin --collection events --file fixtures/test.json
```

## Run
```
mongod
node index.js
```