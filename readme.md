URL: http://stark-shore-8953.herokuapp.com

Start the server by pushing to heroku (using heroku toolbelt)

Once the server is started, you have access to the following REST calls

GET /status
Returns a basic hello world with the status of the server.

GET /init/{api_key}/{MAC_address}
The API key will map to a tenant (you can use "123" or "234" as valid API keys) and the MAC Address is used as a
device unique identifier.  This will return a tenant_id and a device_id to be used by the device afterwards.

GET /metadata
Returns an array of objects containing the name, total data consumption and total number of messages for each of the
tenants that currently have data in the sytem.

GET /metadata/{tenant_id}
Returns an array of objects containing the name, total data consumption and total number of messages for each of the
devices that currently have data in the sytem for a given tenant id.

GET /metadata/{tenant_id}/{device_id}
Returns an array of objects containing the name, total data consumption and total number of messages for each of the
sensors that currently have data in the sytem for a given tenant id and device id.

POST /meta
Payload:
{
 "type": "" //Type of message
 "length": "" //Length of the message
 "topic": "" //The full topic (should be /{tenant_id}/{device_id}/{sensor_id}
}
This will save the meta data in the database and return the tenant's data hub address

This server also has a static server for all files in the /public_html folder.  Pointing your browser to this page
index.html will show the metadata server dashboard.
