$(function() {
  function MainVM() {
    var self = this;
    self.tenantsData = ko.observableArray();
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
      self.tenantsData.splice(index, 1);
    }

    function saveTenant() {
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
      $.getJSON('/tenants', function(data) {
        _.each(data, function (v) {
          self.tenantsData.push(v);
        });
      });


      setInterval(updateMetadataInfo, 1000);
    }

    init();
  }

  ko.applyBindings(new MainVM());
});


//$(function() {
//  //Fetch data from the metadata server
//  $.get("/metadata").success(function(resp) {
//      for (var i = 0; i < resp.length; i++) {
//          var tenant = resp[i];
//          $("<tr>")
//              .addClass("tenant")
//              .append(
//                  $("<td>").text(tenant.name)
//              ).append(
//                  $("<td>").text(tenant.total)
//              ).append(
//                  $("<td>").text(tenant.number)
//              ).on("click", function() {
//                  addTenantDetails(this, $(this).find("td").first().text());
//              }).appendTo(
//                  $("tbody")
//              );
//      }
//  });
//})
//
//
//function submitTenantForm(e) {
//  // stop the regular form submission
//  e.preventDefault();
//
//  // construct an HTTP request
//  var xhr = new XMLHttpRequest();
//  xhr.open(form.method, form.action, true);
//  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
//
//  // send the collected data as JSON
//  xhr.send(form.tenant.value);
//
//  xhr.onloadend = function () {
//    window.location.href = "tenants";
//    // done
//  };
//};
//
//function addTenantDetails(row, tenantId) {
//    if ($(row).hasClass("expanded")) {
//        return;
//    }
//
//    $(row).addClass("expanded");
//
//    $.get("/metadata/" + tenantId).success(function(resp) {
//        for (var i = 0; i < resp.length; i++) {
//            var device = resp[i];
//            $("<tr>")
//                .addClass("device")
//                .append(
//                    $("<td>").text(device.name)
//                ).append(
//                    $("<td>").text(device.total)
//                ).append(
//                    $("<td>").text(device.number)
//                ).on("click", function() {
//                    addDeviceDetails(this, tenantId, $(this).find("td").first().text());
//                }).insertAfter(
//                    $(row)
//                );
//        }
//    });
//}
//
//function addDeviceDetails(row, tenantId, deviceId) {
//    if ($(row).hasClass("expanded")) {
//        return;
//    }
//
//    $(row).addClass("expanded");
//
//    $.get("/metadata/" + tenantId + "/" + deviceId).success(function(resp) {
//        for (var i = 0; i < resp.length; i++) {
//            var sensor = resp[i];
//            $("<tr>")
//                .addClass("sensor")
//                .append(
//                    $("<td>").text(sensor.name)
//                ).append(
//                    $("<td>").text(sensor.total)
//                ).append(
//                    $("<td>").text(sensor.number)
//                ).insertAfter(
//                    $(row)
//                );
//        }
//    });
//}
