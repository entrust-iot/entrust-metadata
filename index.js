var express = require("express");
var uniqueId = require("./libs/guid");
var bodyParser = require("body-parser");

var app = express();

var ids = [];

var db = {
    requests: []
};

var tenants = {
    TENANT1: {
        protocol: "http",
        hostname: "boiling-reef-5375.herokuapp.com",
        port: "80",
        method: "POST"
    }
};

app.use(bodyParser.json());

//GET on / will return server status
app.get("/", function (req, res) {
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

//POST for the meta data that comes from the service gateway
app.post("/meta", function(req, res) {
    var body = req.body;
    //TODO Check for valid data (tenant, id, ...)
    db.requests.push({
        'type' : body.cmd,
        'length': body.length,
        'topic': body.topic
    });
    res.send(JSON.stringify({"tenant_data": tenants["TENANT1"]}));
});

var appPort = process.env.PORT || 5000;

var server = app.listen(appPort, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Entrust metadata running");
});