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
  self.getDeviceByTenant = getDeviceByTenant
  self.getDeviceById = getDeviceById;

  function getDeviceByMAC(tenantId, mac, agentId) {
    var device = _.find(data, { macAddr: mac });

    if (!device) {
      device = new Device(tenantId, mac, agentId);
      data.push(device);
    }

    return device;
  };

  function getDevices() {
    return data;
  }

  function getDeviceByTenant(tenantId) {
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

//    var device = _.find(data, {id: id});
//    if (device) {
//      return device;
//    }
//
//    return _.find(data, {agentId: id});

  function Device(t, m, i) {
    var self = this;

    self.macAddr = m;
    self.tenant = t;
    self.id = uniqueId();
    self.agentId = i;
    self.status = 'online';
  }
};

module.exports = new DevicesCollection();
