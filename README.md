# Connected Thermometer for connected devices 2019

## API for the database

POST /data create a new record in the database
GET /data read all the records for a MAC address
GET /data/:id read one record
DELETE /data/:id delete one record

## Curl tests for the server:

Create:

`$ curl -X POST -d macAddress=AA:BB:CC:DD:EE:FF -d sessionKey=12345678 -d data="hello, world" http://serverAddress/data`

`$ curl -X POST -d macAddress=AA:BB:CC:DD:EE:FF -d sessionKey=12345678  -d data='{"temperature": 70.9,"humidity": 22.5}' http://serverAddress/data`

Read all records:

`$ curl -X GET -d macAddress=AA:BB:CC:DD:EE:FF -d sessionKey=12345678 http://serverAddress/data`

Read one record:

`$ curl -X GET -d macAddress=AA:BB:CC:DD:EE:FF -d sessionKey=12345678 http://serverAddress/data/1`

Delete:

`$ curl -X DELETE -d macAddress=AA:BB:CC:DD:EE:FF -d sessionKey=12345678 http://serverAddress/data/1`
