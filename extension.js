(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {
        socket.close();
    };

    var socket = null;
    var envData = {
        pressure: 0,
        temperature: 0,
        humidity: 0,
        direction: 0
    }

    var LEDCache;

    function sendCommand(commandName, payload) {
        socket.send(JSON.stringify({command:commandName, args:payload}));
    }

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.updatePiAddress = function(newAddress, port, callback) {
        if (socket != null) {
            socket.close();
        }

        socket = new WebSocket("ws://" + newAddress + ":" + port);

        socket.onopen = function (event) {
            ext.fill();

            LEDCache = [];
            for (var x = 0; x < 8; x++) {
                LEDCache[x] = [];
                for (var y = 0; y < 8; y++) {
                    LEDCache[x][y] = "black";
                }
            }

            callback();
        }

        socket.onmessage = function(event) {
            envData = JSON.parse(event.data);
        }
    }

    ext.setRotation = function(rotation) {
        sendCommand("set-rotation", {rotation:rotation});
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

    ext.readColorPlaintext = function(x, y) {
        return LEDCache[x][y];
    }

    ext.setLowLight = function(lowLight) {
        sendCommand("low-light", {on:lowLight});
    };

    ext.fill = function(color) {
        var color = getRGB(colorString);
        sendCommand("fill", {r:color.r, g:color.g, b:color.b});
    }

    ext.getTemperature = function() {return envData.temperature;}

    ext.getHumidity = function() {return envData.humidity;}

    ext.getPressure = function() {return envData.pressure;}

    ext.getDirection = function() {return envData.direction;}

    ext.getOrientation = function(mode) {return envData.orientation.mode;}

    ext.getRaw = function(sensor, mode) {
        switch(sensor+mode) {
            case "accelerometerx": return envData.accelerometer.x;
            case "accelerometery": return envData.accelerometer.y;
            case "accelerometerz": return envData.accelerometer.z;
            case "gyroscopex"    : return envData.gyroscope.x;
            case "gyroscopey"    : return envData.gyroscope.y;
            case "gyroscopez"    : return envData.gyroscope.z;
            case "compassx"      : return envData.compass.x;
            case "compassy"      : return envData.compass.y;
            case "compassz"      : return envData.compass.z;
        }
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'connect to Astro Pi at %s port %s', 'updatePiAddress', '192.168.3.2', '9000'],
            [' ', 'set LED rotation to %m.udlr', 'setRotation', '0'],
            [' ', 'turn low light mode %m.onoff', 'setLowLight', 'on'],
            [' ', 'show message %s in color %m.color', 'sendMessage', 'Hello, World!', 'white'],
            [' ', 'show letter %s in color %m.color', 'showLetter', 'A', 'white'],
            [' ', 'set LED x %n y %n to color %m.color', 'switchOnLedWithColor', 0, 0, 'white'],
            [' ', 'set all LEDs to color %m.color', 'fill', 'white'],
            ['r', 'color of LED x %n y %n', 'readColorPlaintext', 0, 0],
            ['r', 'temperature', 'getTemperature'],
            ['r', 'humidity', 'getHumidity'],
            ['r', 'pressure', 'getPressure'],
            ['r', 'direction', 'getDirection'],
            ['r', 'orientation %m.pyr', 'getOrientation', 'pitch'],
            ['r', 'raw %m.xyz of %m.xyz', 'getRaw', 'x', 'accelerometer']
        ],
        menus: {
            onoff: ['on', 'off'],
            pyr: ['pitch', 'roll', 'yaw'],
            sensor: ['accelerometer', 'gyroscope', 'compass'],
            xyz: ['x', 'y', 'z'],
            udlr: ['0', '90', '180', '270'],
            rgb: ['r', 'g', 'b'],
            color: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'purple', 'cyan']
        }
    };

    // Register the extension
    ScratchExtensions.register('AstroX', descriptor, ext);
})({});