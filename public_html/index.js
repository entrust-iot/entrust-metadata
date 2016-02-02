$(function() {
  var form = document.getElementById('tenant-form');
  if (form.attachEvent) {
      form.attachEvent("submit", submitTenantForm);
  } else {
      form.addEventListener("submit", submitTenantForm);
  }

  //Fetch data from the metadata server
  $.get("/metadata").success(function(resp) {
      for (var i = 0; i < resp.length; i++) {
          var tenant = resp[i];
          $("<tr>")
              .addClass("tenant")
              .append(
                  $("<td>").text(tenant.name)
              ).append(
                  $("<td>").text(tenant.total)
              ).append(
                  $("<td>").text(tenant.number)
              ).on("click", function() {
                  addTenantDetails(this, $(this).find("td").first().text());
              }).appendTo(
                  $("tbody")
              );
      }
  });
})


function submitTenantForm(e) {
  // stop the regular form submission
  e.preventDefault();

  // construct an HTTP request
  var xhr = new XMLHttpRequest();
  xhr.open(form.method, form.action, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  // send the collected data as JSON
  xhr.send(form.tenant.value);

  xhr.onloadend = function () {
    window.location.href = "tenants";
    // done
  };
};

function addTenantDetails(row, tenantId) {
    if ($(row).hasClass("expanded")) {
        return;
    }

    $(row).addClass("expanded");

    $.get("/metadata/" + tenantId).success(function(resp) {
        for (var i = 0; i < resp.length; i++) {
            var device = resp[i];
            $("<tr>")
                .addClass("device")
                .append(
                    $("<td>").text(device.name)
                ).append(
                    $("<td>").text(device.total)
                ).append(
                    $("<td>").text(device.number)
                ).on("click", function() {
                    addDeviceDetails(this, tenantId, $(this).find("td").first().text());
                }).insertAfter(
                    $(row)
                );
        }
    });
}

function addDeviceDetails(row, tenantId, deviceId) {
    if ($(row).hasClass("expanded")) {
        return;
    }

    $(row).addClass("expanded");

    $.get("/metadata/" + tenantId + "/" + deviceId).success(function(resp) {
        for (var i = 0; i < resp.length; i++) {
            var sensor = resp[i];
            $("<tr>")
                .addClass("sensor")
                .append(
                    $("<td>").text(sensor.name)
                ).append(
                    $("<td>").text(sensor.total)
                ).append(
                    $("<td>").text(sensor.number)
                ).insertAfter(
                    $(row)
                );
        }
    });
}
