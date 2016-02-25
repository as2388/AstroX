(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    var apiRoot = "http://192.168.3.2/api/v1/";

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.updatePiAddress = function(newAddress, callback) {
        apiRoot = "http://" + newAddress + "/api/v1/";
        callback();
    }

    function sendRequest(path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + path);
        xhr.onload = function(e) {
            callback();
        }
        xhr.send(null);
    }

    function sendRequest(path) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + path);
        xhr.send(null);
    }

    ext.sendMessage = function(message) {
        sendRequest("sendMessage/" + message);
    };

    ext.switchOnLed = function(x, y, r, g, b) {
        sendRequest("switchOnLed/" + x + "/" + y + "/" + r + "/" + g + "/" + b);
    };

    ext.switchOnLedWithColor = function(x, y, color) {
        var r, g, b;
        switch(color) {
            case 'white': r = 255; g = 255; b = 255; break;
            case 'black': r = 0; g = 0; b = 0; break;
        }
        ext.switchOnLed(x, y, r, g, b);
    }

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

    ext.switchOffLed = function(x, y) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "switchOffLed/" + x + "/" + y);
        xhr.send(null);
    };

    ext.clear = function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + "clear");
        xhr.send(null);
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'set Raspberry Pi address to %s', 'updatePiAddress', '192.168.3.2:80']
            //[' ', 'set LED matrix rotation to %m.udlr', 'up'],
            [' ', 'show message %s', 'sendMessage', 'Hello, World!'],
            /*[' ', 'show letter %s', 'A'],
            [' ', 'turn low light mode %m.onoff', 'setLowLight', 'on'],*/
            //[' ', 'set LED x %n y %n to color %m.color', 'switchOnLedWithColor', 0, 0, 'white']
            [' ', 'set LED x %n y %n to color red %n green %n blue %n', 'switchOnLed', 0, 0, 255, 255, 255],
            /*['R', '%m.rgb component of LED x %n y%n', 'red', 0, 0],
            ['R', 'color of LED x %n y %n', 0, 0,],
            [' ', 'switch off LED x %n y %n', 'switchOffLed', 0, 0],
            [' ', 'clear LEDs', 'clear'],
            ['R', 'temperature', 'getTemperature'],
            ['R', 'relative humidity'],
            ['R', 'pressure'],*/
            //['R', 'direction']
            /*['R', 'orientation %m.pyr', 'getOrientation', 'pitch'],
            ['R', 'raw accelerometer %m.xyz', 'getAccelRaw', 'x']*/
        ],
        menus: {
            onoff: ['on', 'off'],
            pyr: ['pitch', 'roll', 'yaw'],
            xyz: ['x', 'y', 'z'],
            udlr: ['up', 'down', 'left', 'right'],
            rgb: ['r', 'g', 'b'],
            color: ['white', 'black', 'red', 'green', 'blue', 'purple', 'yellow']
        }
    };

    // Register the extension
    ScratchExtensions.register('AstroX', descriptor, ext);
})({});