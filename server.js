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

function readIndex(next) {
    // Read index.html and listen
    fs.readFile('build/index.html', "utf-8", next);
}

function startServer() {

    server = app.listen(port, host, function() {
        process.stdout.write("Listening on " + (host ? 'http://' + host + ':' : 'port ') + port + "\n");
    });
}

/*
 * Starts the servers and index.html is only loaded once at startup.
 */
function staticServe() {
    readIndex(function(err, content) {
        if (err) throw err;

        app.use(function(req, res) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content);
        });

        startServer();
    });
}

/*
 * Starts the server. Every request for index.html receives an updated version.
 */
function dynamicServe() {
    app.use(function(req, res) {
        readIndex(function(err, content) {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("File not Found.");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content);
        });
    });

    startServer();
}

if (process.argv.indexOf("--production") !== -1) {
    console.log("Starting server in production mode...");
    staticServe();
}
else {
    console.log("Starting server in development mode...");
    dynamicServe();
}