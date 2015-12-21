var fakeData = require("../data/tenants.json");

var data = [];

if (fakeData) {
    data = fakeData;
}

var tenantsCollection = function() {
    this.getAll = function() {
        return data;
    };

    this.get = function(id) {
        var tenant = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                tenant = data[i];
                break;
            }
        }
        return tenant;
    };

    this.findTenantByKey = function(key) {
        var tenant = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].key === key) {
                tenant = data[i];
                break;
            }
        }
        return tenant;
    }
};

module.exports = new tenantsCollection();