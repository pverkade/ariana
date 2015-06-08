var connect = require('connect');
var serveStatic = require('serve-static');
var fs = require('fs');
var request = require('request');
var qs = require('querystring');
var gm = require('gm');

// Init
var app = connect();
var server;
var indexPage;
var host = 'localhost';
var port = 80;

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

/* This function resends an image received from a post back, if
 * a correct post was made to /save-image.
 *
 * The image size limit is roughly 100mb.
 *
 * Returns true if a response was send.
 */
function saveImageRouter(req, res) {
    if (req.method == "POST" && req.url == "/save-image") {
        var body = '';
        req.on('data', function (data) {
            body += data;

            // kill connection if too much data (100mb).
            if (body.length > 100 * 1e6) {
                console.log("message is to long:", body.length);
                request.connection.destroy();
            }
        });

        req.on('end', function () {
            var post = qs.parse(body);
            if (!post['image-data'] && !post['image-name']) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("");
                return;
            }

            var inputBuffer = new Buffer(post['image-data'], 'base64');

            gm(inputBuffer, "input.png")
                .flip()
                .toBuffer('PNG',function (err, buffer) {
                    if (err) {
                        console.log("error", err);
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("");
                        return;
                    }

                    res.writeHead(200, {
                        "Content-Type": "Content-type: image/png" ,
                        'Content-Disposition': 'attachment; filename="' + post["image-name"]
                    });

                    res.end(buffer.toString("binary"), "binary");
                    return;
                });
        });

        return true;
    }

    return false;
}

/*
 * Starts the servers and index.html is only loaded once at startup.
 */
function staticServe() {
    readIndex(function(err, content) {
        if (err) throw err;

        app.use(function(req, res) {
            if (saveImageRouter(req, res)) {
                return;
            }

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
        if (saveImageRouter(req, res)) {
            return;
        }

        readIndex(function(err, content) {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
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