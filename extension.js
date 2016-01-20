(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.sendMessage = function(message, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://192.168.3.2/api/v1/sendMessage/" + message);
        xhr.onload = function(e) {
            callback();
        }
        xhr.send(null);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'send message %s', 'sendMessage', 'Hello World'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('AstroX', descriptor, ext);
})({});