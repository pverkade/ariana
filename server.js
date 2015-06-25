/* 
 * Project Ariana
 * server.js
 *
 * This file contains all code to run the node server to host Ariana.
 *
 */

var connect = require('connect');
var serveStatic = require('serve-static');
var fs = require('fs');
var request = require('request');
var qs = require('querystring');
var gm = require('gm').subClass({ imageMagick: true });

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

function startServer(host, port) {
    server = app.listen(port, host, function() {
        process.stdout.write("Listening on " + (host ? 'http://' + host + ':' : 'port ') + port + "\n");
    });
}

/* This saves the inputbuffer into another image buffer. Format specifies the
 * format of the output buffer, and can be either jpeg or png. Additionaly, the image
 * will be flipped vertically.
 *
 * handler has as input: error, outputbuffer.
 *
 * quality can be optionally set for jpeg format.
 */
function saveImageAsBuffer(inputBuffer, format, handler, quality) {
    if (format !== "jpeg" && format !== "png") {
        handler("Bad format", null);
        return;
    }

    var newImage = gm(inputBuffer).flip();

    if (format === 'jpeg') {
        newImage = newImage
            .compress('JPEG')
            .quality(quality)
    }

    newImage.toBuffer(format, handler);
}

function testSaveImageAsBuffer(filename, format, quality) {
    var buf = fs.readFileSync(filename);

    saveImageAsBuffer(buf, format, function (err, buffer) {
        if (err) {
            console.log("error:", err);
            return;
        }

        fs.writeFileSync("output" + "." + format, buffer);
    }, quality);
}

function plainTextResponse(response, statuscode, text) {
    response.writeHead(statuscode, {
        "Content-Type": "text/plain; charset=utf-8"
    });
    response.end(text);
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
                req.connection.destroy();
            }
        });

        req.on('end', function () {
            var post = qs.parse(body);

            if (!post['image-data'] || !post['filename'] || !post['format']) {
                plainTextResponse(res, 400, "Image-data, filename or format is missing from request.");
                return;
            }

            var data = post['image-data'],
                filename = post['filename'],
                format = post['format'],
                quality = post['quality'];

            if (format !== 'jpeg' && format !== 'png') {
                plainTextResponse(res, 400, 'Bad image format.');
                return;
            }
            else if (format === 'jpeg' && (isNaN(quality) || !(0 <= quality && quality <= 100))) {
                plainTextResponse(res, 400, 'Quality not specified correctly.');
                return;
            }

            var inputBuffer = new Buffer(data, 'base64');

            saveImageAsBuffer(inputBuffer, format, function(err, buffer) {
                if (err) {
                    console.log("error", err);
                    plainTextResponse(res, 500, "Internal Server Error");
                    return;
                }

                res.writeHead(200, {
                    "Content-Type": "Content-type: image/" + format ,
                    'Content-Disposition': 'attachment; filename="' + filename + "." + format+ '"'
                });

                res.end(buffer.toString("binary"), "binary");
            }, quality);
        });

        return true;
    }

    return false;
}

/*
 * Starts the servers and index.html is only loaded once at startup.
 */
function staticServe(host, port) {
    readIndex(function(err, content) {
        if (err) throw err;

        app.use(function(req, res) {
            if (saveImageRouter(req, res)) {
                return;
            }

            if (req.url != "/" && req.url != "/index.html" && req.url != "/landing" && req.url != "/drawtest") {
                plainTextResponse(res, 404, "File not Found.");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(content);
        });

        startServer(host, port);
    });
}

/*
 * Starts the server. Every request for index.html receives an updated version.
 */
function dynamicServe(host, port) {
    app.use(function(req, res) {
        if (saveImageRouter(req, res)) {
            return;
        }

        if (req.url != "/" && req.url != "/index.html" && req.url != "/ariana" && req.url != "/drawtest") {
            plainTextResponse(res, 404, "File not found.");
            return;
        }

        readIndex(function(err, content) {
            if (err) {
                plainTextResponse(res, 500, "Index not found.");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(content);
        });
    });

    startServer(host, port);
}

if (process.argv.indexOf("--production") !== -1) {
    console.log("Starting server in production mode...");
    staticServe("0.0.0.0", 80);
}
else {
    console.log("Starting server in development mode...");
    dynamicServe(host, port);
}