var connect = require('connect');
var serveStatic = require('serve-static');
var fs = require('fs');
var request = require('request');

// Init
var app = connect();
var server;
var indexPage;
var host = 'localhost';
var port = 3000;

// Handle POSIX signals
process.on('SIGINT', function() {
    process.stdout.write("Stopping webserver. Bye\n");
    server.close();
    process.exit(0);
});

process.on('SIGHUP', function() {
    fs.readFile(path + '/index.html', function(err, contents) {
        if (err) throw err;
        indexPage = contents;
        process.stdout.write("Reloaded index file\n");
    })
});

// Serve static file
app.use(serveStatic('build', {index: false}));

// Otherwise always serve index.html
app.use(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    var content = indexPage;
    
    res.end(content);
});

// Read index.html and listen
fs.readFile('build/index.html', "utf-8", function(err, contents) {
    if (err) throw err;
    
    indexPage = contents;

    server = app.listen(port, host, function() {
        process.stdout.write("Listening on " + (host ? 'http://' + host + ':' : 'port ') + port + "\n");
    });
});
