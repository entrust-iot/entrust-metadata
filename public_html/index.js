$(function() {
  function MainVM(tenantServerBinding) {
    var self = this;
    self.tenantsData = ko.computed(function() {
      return tenantServerBinding.tenantsData();
    });

    self.metadataData = ko.observableArray();
    self.deviceMapping = ko.observableArray();

    self.addTenant = addTenant;
    self.removeTenant = removeTenant;
    self.saveTenant = saveTenant;

    function addTenant() {
      self.tenantsData.push({
        "id": "",
        "name": "",
        "edh": {
          "protocol": "",
          "hostname": "",
          "port": "",
          "method": ""
        },
        "key": ""
      });
    }
     
    function removeTenant(index) {
      tenantServerBinding.remove(index);
    }

    function saveTenant(index){
    }


    function addOrUpdate(koArr, value, criteria) {
      var index = _.indexOf(koArr(), _.find(koArr(), criteria));

      if (index != -1) {
        koArr.splice(index, 1, value);
      } else {
        koArr.push(value);
      }
    }

    function updateMetadataInfo() {
      $.getJSON('/metadata', function(metadata) {
        _.each(metadata, function (v) {
          addOrUpdate(self.metadataData, v, {name: v.name});
        });

        _(self.metadataData())
          .map('name')
          .each(function(tenantName) {
            $.getJSON('/metadata/' + tenantName, function(devices) {
              devices.tenant = tenantName;
              addOrUpdate(self.deviceMapping, devices, {tenant: devices.tenant});

              console.log(self.deviceMapping());

              _(devices)
                .map('name')
                .each(function(deviceName) {
                  console.log(tenantName, deviceName);

                  $.getJSON('/metadata/' + tenantName + '/' + deviceName, function(sensorsInfo) {
                    console.log(deviceName, sensorsInfo)
                    // TODO: Update depending on UI requirement
                  });
                });
            });
          });
      });
    }

    function init() {
      setInterval(updateMetadataInfo, 1000);
    }

    init();
  }

  ko.applyBindings(new MainVM(new TenantServerBinding()));

  function TenantServerBinding() {
    var self = this;

    self.tenantsData = ko.observableArray();

    function remove(index) {
      self.tenantsData.splice(index, 1);
      saveTenantsToServer();
    }

    function getTenants() {
      $.getJSON('/tenants', function(data) {
        _.each(data, function (v) {
          self.tenantsData.push(v);
        });
      });
    }

    function saveTenantsToServer() {
      var options = {
        url: '/tenants',
        type: 'POST',
        data: JSON.stringify(self.tenantsData()),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function() {
          console.log('success');
        }
      }

      $.ajax(options)
    }

    function init() {
      getTenants();
    }

    init();
  };
});


