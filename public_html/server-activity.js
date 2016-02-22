$(function() {
  function ServerActivityVM() {
    function Tenant() {
      var self = this;

      self.tenantName = ko.observable();
      self.messageCount = ko.observable();
      self.dataSize = ko.observable();
      self.showDevices = ko.observable(false);
      self.isActive = ko.observable(false);

      self.devices = ko.observableArray();

      self.allOnline = ko.computed(function() {
        return _.every(self.devices(), function(d) {
          return d.online();
        });
      });

      self.toggleShowDevice = function() {
        self.showDevices(!self.showDevices());
      };

      var timeoutId = undefined;
      self.activate = function() {
        self.isActive(true);

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(function() {
          self.isActive(false);
          timeoutId = undefined;
        }, 500);
      }

      self.updateData = function(name, size, number) {
        if (self.tenantName() !== name || self.dataSize() !== size || self.messageCount() !== number) {
          self.tenantName(name);
          self.dataSize(size);
          self.messageCount(number);
          self.activate();
        }
      }
    };

    function Device() {
      var self = this;

      self.deviceName = ko.observable();
      self.messageCount = ko.observable();
      self.dataSize = ko.observable();
      self.showSensors = ko.observable(false);
      self.online = ko.observable(true);

      self.sensors = ko.observableArray();

      self.toggleShowSensors = function() {
        self.showSensors(!self.showSensors());
      };

      self.updateData = function(name, size, number) {
        self.deviceName(name);
        self.dataSize(size);
        self.messageCount(number);
      }
    };

    function Sensor() {
      var self = this;

      self.sensorName= ko.observable();
      self.messageCount = ko.observable();
      self.dataSize = ko.observable();

      self.updateData = function(name, size, number) {
        self.sensorName(name);
        self.dataSize(size);
        self.messageCount(number);
      }
    };

    self.data = ko.observableArray();

    function getTenantByName(name) {
      return _.find(self.data(), function(t) {
        return t.tenantName() === name;
      });
    }

    function getDeviceByNameInTenant(tenant, name) {
      return _.find(tenant.devices(), function(d) {
        return d.deviceName() === name;
      });
    }

    function getSensorInDevice(device, name) {
      return _.find(device.sensors(), function(s) {
        return s.sensorName() === name;
      });
    }



    function updateMetadataInfo() {
      $.getJSON('/metadata', function(metadata) {
        _.each(metadata, function (v) {
          var t = getTenantByName(v.name);

          if (!t) {
            t = new Tenant();
            self.data.push(t);
          }

          t.updateData(v.name, v.total, v.number);
        });

        _.each(self.data(), function(t) {
          $.getJSON('/metadata/' + t.tenantName()).success(function(devices) {
            _.each(devices, function(device) {
              var d = getDeviceByNameInTenant(t, device.name);

              if (!d) {
                d = new Device();
                t.devices.push(d);
              }

              d.updateData(device.name, device.total, device.number);

              $.getJSON('/devices/' +  d.deviceName(), function (deviceInfo) {
                d.online(deviceInfo.status === 'online');
              });

              $.getJSON('/metadata/' + t.tenantName() + '/' + d.deviceName(), function (sensors) {
                _.each(sensors, function(sensor) {
                  var s = getSensorInDevice(d, sensor.name);

                  if (!s) {
                    s = new Sensor();
                    d.sensors.push(s);
                  }

                  s.updateData(sensor.name, sensor.total, sensor.number);
                });
              });
            });
          });
        })
      });
    }




    function init() {
      setInterval(updateMetadataInfo, 1000);
    }

    init();

  }

  ko.applyBindings(new ServerActivityVM());
});
