$(function() {
  function ServerActivityVM() {
    function Tenant() {
      var self = this;

      self.tenantName = ko.observable("TENANT1");
      self.messageCount = ko.observable(123);
      self.dataSize = ko.observable(4000);
      self.showDevices = ko.observable(false);
      self.isActive = ko.observable(false);

      self.devices = ko.observableArray([
        new Device(),
        new Device(),
        new Device(),
        new Device(),
        new Device()
      ]);

      self.allOnline = ko.computed(function() {
        return _.every(self.devices(), function(d) {
          return d.online();
        });
      });

      self.toggleShowDevice = function() {
        self.showDevices(!self.showDevices());
      };

      self.activate = function() {
        self.isActive(true);

        timeout(function() {
          self.isActive(false)
        }, 1000);
      }
    };

    function Device() {
      var self = this;

      self.deviceName = ko.observable("myDevice");
      self.messageCount = ko.observable(133);
      self.dataSize = ko.observable(3000);
      self.showSensors = ko.observable(false);
      self.online = ko.observable(true);

      self.sensors = ko.observableArray([
        new Sensor(),
        new Sensor(),
        new Sensor()
      ]);

      self.toggleShowSensors = function() {
        self.showSensors(!self.showSensors());
      };
    };

    function Sensor() {
      var self = this;

      self.sensorName= ko.observable("myDevice");
      self.messageCount = ko.observable(133);
      self.dataSize = ko.observable(3000);
    };

    self.data = ko.observableArray([
      new Tenant(),
      new Tenant(),
      new Tenant()
    ]);

    console.log(self.data());

    self.deviceMapping = ko.observableArray();

//    function updateMetadataInfo() {
//      $.getJSON('/metadata', function(metadata) {
//        _.each(metadata, function (v) {
//          addOrUpdate(self.metadataData, v, {name: v.name});
//        });
//
//        _(self.metadataData())
//          .map('name')
//          .each(function(tenantName) {
//            $.getJSON('/metadata/' + tenantName, function(devices) {
//              devices.tenant = tenantName;
//              addOrUpdate(self.deviceMapping, devices, {tenant: devices.tenant});
//
//              console.log(self.deviceMapping());
//
//              _(devices)
//                .map('name')
//                .each(function(deviceName) {
//                  console.log(tenantName, deviceName);
//
//                  $.getJSON('/metadata/' + tenantName + '/' + deviceName, function(sensorsInfo) {
//                    console.log(deviceName, sensorsInfo)
//                    // TODO: Update depending on UI requirement
//                  });
//                });
//            });
//          });
//      });
//    }
//
//    function init() {
//      setInterval(updateMetadataInfo, 1000);
//    }
//
//    init();
//
  }

  ko.applyBindings(new ServerActivityVM());
});
