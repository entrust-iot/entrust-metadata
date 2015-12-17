URL: http://stark-shore-8953.herokuapp.com

Start the server by pushing to heroku (using heroku toolbelt)

Once the server is started, you have access to the following REST calls

GET /
Returns a basic hello world with the status of the server.

GET /init/{api_key}/{MAC_address}
The API key will map to a tenant (you can use "123" or "234" as valid API keys) and the MAC Address is used as a
device unique identifier.  This will return a tenant_id and a device_id to be used by the device afterwards.

POST /meta
Payload:
{
 "type": "" //Type of message
 "length": "" //Length of the message
 "topic": "" //The full topic (should be /{tenant_id}/{device_id}/{sensor_id}
}
This will save the meta data in the database and return the tenant's data hub address

