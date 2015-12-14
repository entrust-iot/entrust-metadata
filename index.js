var express = require("express");
var uniqueId = require("./libs/guid");

var app = express();

var ids = [];

//GET on / will return server status
app.get('/', function (req, res) {
  var genericResp = "Server status: running<br>";
  genericResp += "Current date/time: " + (new Date()).toString() + "<br>";
  genericResp += "Hello world";
  res.send(genericResp);
});

//GET on /init will return a unique id and tenant id
app.get("/init", function (req, res) {
  var data = {};
  data.id = uniqueId(ids);
  ids.push(data.id);
  data.tenant = "TENANT1";
  res.send(JSON.stringify(data));
});

var appPort = process.env.PORT || 5000;

var server = app.listen(appPort, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});