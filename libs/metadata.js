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
    /**
     * This function stores the data as individual rows
     * @param metadata {type, length, topic, tenant, deviceId, sensorId}
     * @returns {boolean} true on success
     */
    this.addRow = function(metadata) {
        data.push(metadata);
        return true;
    };

    /**
     * Reorganizes the data so that we can send totals and quantities
     * @returns {tenantId: {total, number, devices: {total, number, sensors: {total: number}}}
     */
    this.aggregateData = function() {
        var agg = {};
        for (var i = 0; i < data.length; i++) {
            if (!agg[data[i].tenant]) {
                agg[data[i].tenant] = {total: 0, number: 0, devices: {}};
            }

            agg[data[i].tenant].total += parseInt(data[i]["length"]);
            agg[data[i].tenant].number++;

            if (!agg[data[i].tenant].devices[data[i].deviceId]) {
                agg[data[i].tenant].devices[data[i].deviceId] = {total: 0, number: 0, sensors: {}};
            }

            agg[data[i].tenant].devices[data[i].deviceId].total += parseInt(data[i]["length"]);
            agg[data[i].tenant].devices[data[i].deviceId].number++;

            if (!agg[data[i].tenant].devices[data[i].deviceId].sensors[data[i].sensorId]) {
                agg[data[i].tenant].devices[data[i].deviceId].sensors[data[i].sensorId] = {total: 0, number: 0};
            }

            agg[data[i].tenant].devices[data[i].deviceId].sensors[data[i].sensorId].total += parseInt(data[i]["length"]);
            agg[data[i].tenant].devices[data[i].deviceId].sensors[data[i].sensorId].number++;
        }

        return agg;
    };

    /**
     * Returns an array with one row per tenant with the associated
     * total data and number of messages
     * @returns {Array}
     */
    this.getMetadata = function() {
        return this.getMetadataByTenant();
    };

    /**
     * Returns an array with one row per device for a given device with
     * the associated total data and number of messages
     * @param tenantId The tenant for which we want a list of devices
     * @returns {Array}
     */
    this.getMetadataByTenant = function(tenantId) {
        return this.getMetadataByDevice(tenantId);
    };

    /**
     * Returns an array with one row per sensor for a given device for
     * a given tenant with the associated total data and number of
     * messages
     * @param tenantId The tenant for which we want the devices
     * @param deviceId The device for this we want the list of sensors
     * @returns {Array}
     */
    this.getMetadataByDevice = function(tenantId, deviceId) {
        var agg = this.aggregateData();

        //Reformat the data
        var reformatted = [];
        if (tenantId === undefined) {
            //Send an array of tenants
            for (var tenant in agg) {
                var newObject = {
                    name: tenant,
                    total: agg[tenant].total,
                    number: agg[tenant].number
                };
                reformatted.push(newObject);
            }
        } else if (tenantId !== undefined && deviceId === undefined) {
            //Send an array of devices
            for (var device in agg[tenantId].devices) {
                var newObject = {
                    name: device,
                    total: agg[tenantId].devices[device].total,
                    number: agg[tenantId].devices[device].number
                };
                reformatted.push(newObject);
            }
        } else {
            //Send an array of sensors
            for (var sensor in agg[tenantId].devices[deviceId].sensors) {
                var newObject = {
                    name: sensor,
                    total: agg[tenantId].devices[deviceId].sensors[sensor].total,
                    number: agg[tenantId].devices[deviceId].sensors[sensor].number
                };
                reformatted.push(newObject);
            }
        }

        return reformatted;
    }
};

module.exports = new metadataCollection();