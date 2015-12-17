var express = require("express");
var bodyParser = require("body-parser");
var tenants = require("./libs/tenants");
var devices = require("./libs/devices");
var metadata = require("./libs/metadata");

var app = express();

app.use(bodyParser.json());

//GET on / will return server status
app.get("/", function (req, res) {
    console.log("Client request for server status on /");
    var genericResp = "Server status: running<br>";
    genericResp += "Current date/time: " + (new Date()).toString() + "<br>";
    genericResp += "Hello world";
    res.send(genericResp);
});

//GET on /init will return a unique id and tenant id
app.get("/init/:apikey/:uniqueid", function (req, res) {
    console.log("Device is requesting a tenant id and device id")
    var data = {};
    data.tenant = tenants.findTenantByKey(req.params.apikey);
    data.id = devices.getDeviceByMAC(req.params.uniqueid);
    res.send(JSON.stringify(data));
});

//POST for the meta data that comes from the service gateway
app.post("/meta", function(req, res) {
    console.log("Recevied POST request to add metadata");
    var body = req.body;
    if (body.topic.substr(0,1) === "/") {
        body.topic.substr(1);
    }
    var splittedTopic = body.topic.split("/");
    var tenant = splittedTopic[0];
    var deviceId = splittedTopic[1];
    var sensorId = splittedTopic[2];

    var tenantId = tenants.findTenantByKey(tenant);

    if (tenantId === null || devices.getDeviceById(deviceId) || !sensorId) {
        res.status(403).send("Topic should be '/{tenant_id}/{device_id}/{sensor_id}").end();
    }

    metadata.addRow({
        "type" : body.cmd,
        "length": body.length,
        "topic": body.topic,
        "tenant": tenant,
        "deviceId": deviceId,
        "sensorId": sensorId
    });

    var sendData = {
        "tenant_data": tenantId ? tenantId.edh : "",
        "timestamp": (new Date()).getTime()
    };

    console.log("Sending meta response");
    console.log(sendData);

    res.json(sendData);
});

var appPort = process.env.PORT || 5000;

var server = app.listen(appPort, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Entrust metadata running");
});