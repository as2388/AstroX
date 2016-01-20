(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    var apiRoot = "http://192.168.3.2/api/v1/";

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.sendMessage = function(message, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "sendMessage/" + message);
        xhr.onload = function(e) {
            callback();
        }
        xhr.send(null);
    };

    ext.setLowLight = function(lowLight, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "lowLight/" + lowLight);
        xhr.onload = function(e) {
            callback();
        }
        xhr.send(null);
    };

    ext.getTemperature = function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "getTemperature");
        xhr.onload = function(e) {
            callback(xhr.responseText);
        }
        xhr.send(null);
    };

    ext.getOrientation = function(property, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "getOrientation");
        xhr.onload = function(e) {
            var result = JSON.parse(xhr.responseText);
            callback(result[property]);
        }
        xhr.send(null);
    };

    ext.getAccelRaw = function(property, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "getAccelRaw");
        xhr.onload = function(e) {
            var result = JSON.parse(xhr.responseText);
            callback(result[property]);
        }
        xhr.send(null);
    };

    ext.switchOnLed = function(x, y, r, g, b) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "switchOnLed/" + x + "/" + y + "/" + r + "/" + g + "/" + b);
        xhr.onload = function(e) {
            
        }
        xhr.send(null);
    };

    ext.switchOffLed = function(x, y) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "switchOffLed/" + x + "/" + y);
        xhr.onload = function(e) {
            
        }
        xhr.send(null);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'send message %s', 'sendMessage', 'Hello, World!'],
            ['w', 'turn low light mode %m.onoff', 'setLowLight', 'on'],
            [' ', 'set LED x %n y %n to color r %n g %n b %n', 'switchOnLed', 0, 0, 255, 255, 255],
            [' ', 'switch off LED x %n y %n', 'switchOffLed', 0, 0],
            ['R', 'temperature', 'getTemperature'],
            ['R', 'orientation %m.pyr', 'getOrientation', 'pitch'],
            ['R', 'raw accelerometer %m.xyz', 'getAccelRaw', 'x']
        ],
        menus: {
            onoff: ['on', 'off'],
            pyr: ['pitch', 'roll', 'yaw'],
            xyz: ['x', 'y', 'z']
        }
    };

    // Register the extension
    ScratchExtensions.register('AstroX', descriptor, ext);
})({});