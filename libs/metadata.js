var data = [];

//Metadata def
//{
//    'type' : body.cmd,
//    'length': body.length,
//    'topic': body.topic,
//    'tenant': tenant,
//    'deviceId': deviceId,
//    'sensorId': sensorId
//}

var metadataCollection = function() {
    this.addRow = function(metadata) {
        data.push(metadata);
        return true;
    }
};

module.exports = metadataCollection();