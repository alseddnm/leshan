var myModule = angular.module('lwResourcesServices', []);

myModule.factory('lwResources', function() {
    var serviceInstance = {};
    serviceInstance.buildResourceTree = buildResourceTree;
    serviceInstance.findResource = findResource ;
    return serviceInstance;
});

/**
 * Get array from url string (e.g. : "/3/0/1" => [3,0,1])
 */
var url2array = function(url) {
    if (url.length > 0 && url.charAt(0) === '/') {
        url = url.substr(1);
    }
    return url.split("/");
}

/**
 * Search an element in an array by id
 */
var searchById = function(array, id) {
    for (i in array) {
        var elem = array[i]
        if (elem.id == id) {
            return elem;
        }
    }
    return undefined;
}

/**
 * Search a resource in the given tree
 */
var findResource = function(tree, url) {
    var resourcepath = url2array(url);
    
    if (resourcepath.length == 3){
        var object = searchById(tree,resourcepath[0]);
        if (object != undefined){
            var instance = searchById(object.instances, resourcepath[1])
            if (instance != undefined){
                return searchById(instance.resources, resourcepath[2])
            }
        }
    }
    return null;
}

/**
 * Build Resource Tree for the given objectLinks
 */
var buildResourceTree = function(objectLinks) {
    if (objectLinks.length == 0)
        return [];

    var tree = [];
    var objectDefs = getObjectDefinitions();

    for (var i = 0; i < objectLinks.length; i++) {
        // get list of resource (e.g. : [3] or [1,123]
        var resourcepath = url2array(objectLinks[i].url);
        var attributes = objectLinks[i].attributes;

        switch (resourcepath.length) {
        case 1:
            // object
            var object = addObject(tree, objectDefs, resourcepath[0],
                    attributes)

            // manage single instance
            if (object.instancetype != "multiple") {
                addInstance(object, 0, [])
            }

            break;
        case 2:
            // intance
            var object = addObject(tree, objectDefs, resourcepath[0], [])
            addInstance(object, resourcepath[1], attributes)

            break;
        case 3:
        default:
            // resource
            var object = addObject(tree, objectDefs, resourcepath[0], [])
            var instance = addInstance(object, resourcepath[1], [])
            addResource(object, instance, resourcepath[2], attributes)

            break;
        }
    }
    return tree;
}

/**
 * add object with the given ID to resource tree if necessary and return it
 */
var addObject = function(tree, objectDefs, objectId, attributes) {
    var object = searchById(tree, objectId);

    // if object is not already in the tree
    if (object == undefined) {
        // search object definition for this id
        object = objectDefs[objectId];

        // manage unknown object
        if (object == undefined) {
            object = {
                name : objectId,
                id : objectId,
                instancetype : "multiple",
                resourcedefs : []
            };
        }

        // add instances field to this object
        object.instances = [];

        // add object to tree
        tree.push(object);
    }
    // TODO Manage attributes
    return object;
}

/**
 * add instance with the given ID to resource tree if necessary and return it
 */
var addInstance = function(object, instanceId, attributes) {
    var instance = searchById(object.instances, instanceId);

    // create instance if necessary
    if (instance == undefined) {
        instance = {
            name : instanceId,
            id : instanceId,
            resources : []
        };

        for (j in object.resourcedefs) {
            var resourcedef = object.resourcedefs[j]
            instance.resources.push({
                def : resourcedef,
                id : resourcedef.id
            });
        }
        object.instances.push(instance);
    }
    // TODO Manage attributes
    return instance;
}

/**
 * add resource with the given ID to resource tree if necessary and return it
 */
var addResource = function(object, instance, resourceId, attributes) {
    var resource = searchById(instance, resourceId);

    // create resource if necessary
    if (resource == undefined) {
        // create resource definition
        var resourcedef = {
            name : resourceId,
            id : resourceId,
            operations : "RW"
        };
        object.resourcedefs.push(resourcedef)

        // create resource
        resource = {
            def : resourcedef,
            id : resourceId, 
        };
        instance.resources.push(resource);
    }

    // TODO Manage attributes
    return resource;
}

/**
 * Return model describing the LWM2M Objects defined by OMA
 */
var getObjectDefinitions = function() {
    return [ {
        name : "LWM2M Security",
        id : "0",
        instancetype : "multiple",
        resourcedefs : [ {
            name : "LWM2M Server URI",
            id : "0"
        }, {
            name : "Bootstrap Server",
            id : "1"
        }, {
            name : "Security Mode",
            id : "2"
        }, {
            name : "Public Key or Identity",
            id : "3"
        }, {
            name : "Server Public Key or Identity",
            id : "4"
        }, {
            name : "Secret Key",
            id : "5"
        }, {
            name : "Short Server ID",
            id : "6"
        }, {
            name : "Client Hold Off Time",
            id : "7"
        } ]
    }, {
        name : "LWM2M Server",
        id : "1",
        instancetype : "multiple",
        resourcedefs : [ {
            name : "Short Server ID",
            id : "0",
            operations : "R"
        }, {
            name : "Lifetime",
            id : "1",
            operations : "RW"
        }, {
            name : "Default Minimum Period",
            id : "2",
            operations : "RW"
        }, {
            name : "Default Maximum Period",
            id : "3",
            operations : "RW"
        }, {
            name : "Disable",
            id : "4",
            operations : "E"
        }, {
            name : "Disable Timeout",
            id : "5",
            operations : "RW"
        }, {
            name : "Notification Storing When Disabled or Offline",
            id : "6",
            operations : "RW"
        }, {
            name : "Binding",
            id : "7",
            operations : "RW"
        }, {
            name : "Registration of Update Trigger",
            id : "8",
            operations : "E"
        } ]
    }, {
        name : "Access Control",
        id : "2",
        resourcedefs : [ {
            name : "Object ID",
            id : "0"
        }, {
            name : "Object Instance ID",
            id : "1"
        }, {
            name : "ACL",
            id : "2"
        }, {
            name : "Access Control Owner",
            id : "3"
        } ]
    }, {
        name : "Device",
        id : "3",
        instancetype : "single",
        resourcedefs : [ {
            name : "Manufacturer",
            id : "0",
            operations : "R",
            type : "string"
        }, {
            name : "Model Number",
            id : "1",
            operations : "R",
            type : "string"
        }, {
            name : "Serial Number",
            id : "2",
            operations : "R",
            type : "string"
        }, {
            name : "Firmware Version",
            id : "3",
            operations : "R",
            type : "string"
        }, {
            name : "Reboot",
            id : "4",
            operations : "E"
        }, {
            name : "Factory Reset",
            id : "5",
            operations : "E"
        }, {
            name : "Available Power Sources",
            id : "6",
            operations : "R",
            type : "integer",
            instances : "multiple"
        }, {
            name : "Power Source Voltage",
            id : "7",
            operations : "R",
            type : "integer",
            instances : "multiple"
        }, {
            name : "Power Source Current",
            id : "8",
            operations : "R",
            type : "integer",
            instances : "multiple"
        }, {
            name : "Battery Level",
            id : "9",
            operations : "R",
            type : "integer"
        }, {
            name : "Memory Free",
            id : "10",
            operations : "R",
            type : "integer"
        }, {
            name : "Error Code",
            id : "11",
            operations : "R",
            type : "integer",
            instances : "multiple"
        }, {
            name : "Reset Error Code",
            id : "12",
            operations : "E"
        }, {
            name : "Current Time",
            id : "13",
            operations : "RW",
            type : "time"
        }, {
            name : "UTC Offset",
            id : "14",
            operations : "RW",
            type : "string"
        }, {
            name : "Timezone",
            id : "15",
            operations : "RW",
            type : "string"
        }, {
            name : "Supported Binding and Modes",
            id : "16",
            operations : "R",
            type : "string"
        } ]
    }, {
        name : "Connectivity Monitoring",
        id : "4",
        resourcedefs : []
    }, {
        name : "Firmware",
        id : "5",
        resourcedefs : [ {
            name : "Instance 0",
            id : "0",
            values : [ {
                name : "Package",
                id : "0",
                operations : "W",
                type : "opaque"
            }, {
                name : "Package URI",
                id : "1",
                operations : "W",
                type : "string"
            }, {
                name : "Update",
                id : "2",
                operations : "E"
            }, {
                name : "State",
                id : "3",
                operations : "R",
                type : "integer"
            }, {
                name : "Update Supported Objects",
                id : "4",
                operations : "RW",
                type : "boolean"
            }, {
                name : "Update Result",
                id : "5",
                operations : "R",
                type : "integer"
            } ]
        } ]
    }, {
        name : "Location",
        id : "6",
        resourcedefs : []
    }, {
        name : "Connectivity Statistics",
        id : "7",
        resourcedefs : []
    } ]
}