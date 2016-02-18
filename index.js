var bodyParser = require("body-parser");
var express = require("express");
var tenants = require("./libs/tenants");
var devices = require("./libs/devices");
var metadata = require("./libs/metadata");
var _ = require('lodash');

var app = express();

app.use(bodyParser.json());
// Redirect all http requests to https, x-forwarded-proto is provided
// by Heroku routing
app.use(function(req, res, next) {
    // if running locally don't redirect to ssl
    if (process.env.LOCAL) {
        return next();
    }
    var reqType = req.headers["x-forwarded-proto"];
    reqType == 'https' ? next() : res.redirect("https://" + req.headers.host + req.url);
});

//GET on /status will return server status
app.get("/status", function (req, res) {
    console.log("Client request for server status on /");
    var genericResp = "Server status: running<br>";
    genericResp += "Current date/time: " + (new Date()).toString() + "<br>";
    genericResp += "Hello world";
    res.send(genericResp);
});

//POST on /init will return a unique id and tenant id
app.post("/init", function (req, res) {
    console.log("Device is requesting a tenant id and device id");
    var inData = req.body;
    var data = {};
    data.tenant = tenants.findTenantByKey(inData.apiKey).id;

    var device = devices.getDeviceByMAC(data.tenant, inData.mac,
            inData.agentId, inData.edgeId, inData.certName);
    if (nameMismatch(inData.certName, device, res)) {
        return;
    }
    device.status = 'online';
    data.id = device.id;

    res.send(JSON.stringify(data));
});

app.get("/devices", function (req, res) {
    var data = devices.getDevices();
    res.send(JSON.stringify(data));
});

app.get("/devices/:deviceId", function (req, res) {
    var data = devices.getDeviceById(req.params.deviceId);
    res.send(JSON.stringify(data));
});



app.put("/devices/:deviceId", function (req, res) {
    var status = req.body.status;

    var data = devices.getDeviceById(req.params.deviceId);
    data.status = status;

    res.send(JSON.stringify(data));
});

//app.get("/edges", function (req, res) {
//    var data = devices.getEdges();
//    res.send(JSON.stringify(data));
//});
//
//app.get("/edges/:edgeId", function (req, res) {
//    var data = devices.getEdgeById(req.params.edgeId);
//    res.send(JSON.stringify(data));
//});

app.put("/edges/:edgeId", function (req, res) {
    var devicesList = devices.getDevicesByEdgeId(req.params.edgeId);
    var status = req.body.status;

    _.each(devicesList, function(device) {
      device.status = status;
    });

    res.send(JSON.stringify(devicesList));
});

//GET to return all the metadata by tenants
app.get("/metadata", function(req, res) {
    res.json(metadata.getMetadata());
});

//GET to return all the metadata for a specific tenant
app.get("/metadata/:tenantId", function(req, res) {
    res.json(metadata.getMetadataByTenant(req.params.tenantId));
});

//GET to return all the metadata for a specific device
app.get("/metadata/:tenantId/:deviceId", function(req, res) {
    res.json(metadata.getMetadataByDevice(req.params.tenantId, req.params.deviceId));
});

app.get("/tenants", function(req, res) {
	res.json(tenants.getAll());
});

app.post("/tenants", function(req, res) {
  var data = req.body;
  console.log("Received POST request to add tenant: " + JSON.stringify(data));

  tenants.replaceData(data);

  res.json({"hello":"world"});
})


//POST for the meta data that comes from the service gateway
app.post("/meta", function(req, res) {
    console.log("Received POST request to add metadata");
    var body = req.body;
    if (body.topic.substr(0,1) === "/") {
        body.topic = body.topic.substr(1);
    }
    console.log("Analyzing topic " + body.topic);
    var splittedTopic = body.topic.split("/");
    var tenant = splittedTopic[0];
    var deviceId = splittedTopic[1];
    var sensorId = splittedTopic[2];

    var tenantId = tenants.findTenantById(tenant);
    console.log(tenantId);

    var device = devices.getDeviceById(deviceId);
    device.status = 'online';

    if (tenantId === null || !sensorId) {
        res.status(403).send("Topic should be '/{tenant_id}/{device_id}/{sensor_id}").end();
        return;
    }

    // Check cert name
    if (nameMismatch(body.certName, device, res)) {
        return;
    } else {
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
    }
});

//Add a static server for files under the public_html folder
app.use(express.static(__dirname + "/public_html"));

var appPort = process.env.PORT || 5000;

var server = app.listen(appPort, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Entrust metadata running");
});

function nameMismatch(certName, device, res) {
console.log('nameMismatch', certName, device.name)
    if (certName !== device.name) {
        device.status = 'untrusted';
        res.status(403).send("Certificate name mismatch").end();
        return true;
    }
    return false;
}
