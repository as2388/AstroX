(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    var socket;
    var envData = {
        pressure: 0,
        temperature: 0,
        humidity: 0
    }

    function sendCommand(commandName, payload) {
        socket.send(JSON.stringify({command:commandName, args:payload}));
    }

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.updatePiAddress = function(newAddress, callback) {
        socket = new WebSocket("ws://" + newAddress);

        socket.onopen = function (event) {
            callback();
        }

        socket.onmessage = function(event) {
            envData = JSON.parse(event.data);
        }
    }

    function sendRequest(path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + path);
        xhr.onload = function(e) {
            callback(xhr.responseText);
        }
        xhr.send(null);
    }

    function sendRequest(path) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot + path);
        xhr.send(null);
    }

    ext.setRotation = function(rotation) {
        sendRequest("setRotation/" + rotation)
    }

    ext.sendMessage = function(message, colorString) {
        var color = getRGB(colorString);
        sendCommand("show-message", {message:message, r:color.r, g:color.g, b:color.b});
    };

    ext.showLetter = function(letter, colorString) {
        var color = getRGB(colorString);
        sendCommand("show-letter", {letter:letter[0], r:color.r, g:color.g, b:color.b});
    }

    function getRGB(color) {
        var r, g, b;
        switch(color) {
            case 'white' : r = 255; g = 255; b = 255; break;
            case 'black' : r = 0;   g = 0;   b = 0;   break;
            case 'red'   : r = 255; g = 0;   b = 0;   break;
            case 'green' : r = 0;   g = 255; b = 0;   break;
            case 'blue'  : r = 0;   g = 0;   b = 255; break;
            case 'yellow': r = 255; g = 255; b = 0;   break;
            case 'purple': r = 255; g = 0;   b = 255; break;
            case 'cyan'  : r = 0;   g = 255; b = 255; break;
        }
        return {r:r, g:g, b:b};
    }

    ext.switchOnLed = function(x, y, r, g, b) {
        sendCommand("led-on", {x:x, y:y, r:r, g:g, b:b});
    };

    ext.switchOnLedWithColor = function(x, y, colorString) {
        var color = getRGB(colorString);
        ext.switchOnLed(x, y, color.r, color.g, color.b);
    }

    ext.setLowLight = function(lowLight) {
        sendCommand("low-light", {on:lowLight});
    };

    ext.readColorRGB = function(component, x, y, callback) {
        sendRequest("getLedColor/");
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

    ext.getTemperature = function() {return envData.temperature;}

    ext.getHumidity = function() {return envData.humidity;}

    ext.getPressure = function() {return envData.pressure;}

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'connect to Astro Pi at address %s', 'updatePiAddress', '192.168.3.2:9000'],
            //[' ', 'set LED matrix rotation to %m.udlr', 'setRotation', '0'],
            [' ', 'turn low light mode %m.onoff', 'setLowLight', 'on'],
            [' ', 'show message %s in color %m.color', 'sendMessage', 'Hello, World!', 'white'],
            [' ', 'show letter %s in color %m.color', 'showLetter', 'A', 'white'],
            [' ', 'set LED x %n y %n to color %m.color', 'switchOnLedWithColor', 0, 0, 'white'],
            //[' ', 'set LED x %n y %n to color red %n green %n blue %n', 'switchOnLed', 0, 0, 255, 255, 255],
            //['R', '%m.rgb component of LED x %n y%n', 'readColorRGB', 'red', 0, 0],
            //['R', 'color of LED x %n y %n', 'readColorPlaintext', 0, 0]
            /*
            [' ', 'switch off LED x %n y %n', 'switchOffLed', 0, 0],
            [' ', 'clear LEDs', 'clear'],*/
            ['r', 'temperature', 'getTemperature'],
            ['r', 'humidity', 'getHumidity'],
            ['r', 'pressure', 'getPressure'],
            //['R', 'direction']
            /*['R', 'orientation %m.pyr', 'getOrientation', 'pitch'],
            ['R', 'raw accelerometer %m.xyz', 'getAccelRaw', 'x']*/
        ],
        menus: {
            onoff: ['on', 'off'],
            pyr: ['pitch', 'roll', 'yaw'],
            xyz: ['x', 'y', 'z'],
            udlr: ['0', '90', '180', '270'],
            rgb: ['r', 'g', 'b'],
            color: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'purple', 'cyan']
        }
    };

    // Register the extension
    ScratchExtensions.register('AstroX', descriptor, ext);
})({});