var express = require('express');
var app = express();

app.get('/', function (req, res) {
  console.log("Got request at /");
  res.send('Hello World!');
});

var appPort = process.env.PORT || 5000;

var server = app.listen(appPort, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});