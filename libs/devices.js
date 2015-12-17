var uniqueId = require("./guid");

var data = [];

//Device definition
//{
//    "id": uniqueGuidLikeIdentifier,
//    "MACAdd": "MAC Address"
//}

var devicesCollection = function() {
    this.getDeviceByMAC = function(mac) {
        var device = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].MACAdd === mac) {
                device = data[i];
                break;
            }
        }
        //If no matching MAC Address were found, generate a new id
        if (device === null) {
            device = {
                id: uniqueId(),
                MACAdd: mac
            };
        }

        return device;
    };
    this.getDeviceById = function(id) {
        var device = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                device = data[i];
                break;
            }
        }

        return device;
    }
};

module.exports = new devicesCollection();