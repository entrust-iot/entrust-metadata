var uniqueId = require("./guid");
var _ = require('lodash');

var data = [];

//Device definition
//{
//    "id": uniqueGuidLikeIdentifier,
//    "macAddr": "MAC Address"
//    "status": "online"
//}

var DevicesCollection = function() {
  var self = this;

  self.getDevices = getDevices;
  self.getDeviceByMAC = getDeviceByMAC;
  self.getDevicesIdByTenant = getDevicesIdByTenant
  self.getDeviceById = getDeviceById;
  self.getDevicesByEdgeId = getDevicesByEdgeId;

  function getDeviceByMAC(tenantId, mac, agentId, edgeId) {
    var device = _.find(data, { macAddr: mac });

    if (!device) {
      device = new Device(tenantId, mac, agentId, edgeId);
      data.push(device);
    }

    device.agentId = agentId;
    device.edgeId = edgeId;

    return device;
  };

  function getDevices() {
    return data;
  }

  function getDevicesIdByTenant(tenantId) {
    return _(data)
           .filter({tenant: tenantId})
           .map('id')
           .value();
  }

  function getDeviceById(id) {
    return _.find(data, function(i) {
      return (i.id === id ||
              i.agentId == id);
    });
  }

  function getDevicesByEdgeId(edgeId) {
    return _.filter(data, {edgeId: edgeId});
  }

  function Device(t, m, i, e) {
    var self = this;

    self.macAddr = m;
    self.tenant = t;
    self.id = uniqueId();
    self.agentId = i;
    self.edgeId = e;
    self.status = 'online';
  }
};

module.exports = new DevicesCollection();
