/*const http = require('http');

const server = http.createServer((req, res) => {
    console.log('Päring saadud')
});

server.listen(3000, () => {
    console.log('Server töötab pordil 3000');
});

*/
/*
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);
    res.write('<h1>Tervitused serverist</h1>');
    res.write('<p>See tekst tuli Node.js serverist</p>');
    res.end();
});

server.listen(3000, () => {
    console.log('Server töötab pordil 3000');
});

*/
/*
const http=require('http');
const fs=require('fs');

const server=http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('./View/index.html', (err, data) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.write(data);
            res.end();
        }
    });
});

server.listen(3000, () => {
    console.log('Server töötab pordil 3000');
});

*/

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');

    let filePath = './view/index.html';

    if (req.url === '/') {
        filePath = './views/index.html';
    } else if (req.url === '/teenused') {
        filePath = './views/teenused.html';
    }else if (req.url === '/vana-leht') {
        res.statusCode = 301;
        res.setHeader('Location', '/');
        res.end();
    } else {
        res.statusCode = 404;
        filePath = './views/404.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.end();
        } else {
            res.end(data);
        }
    });
});

server.listen(3000, () => {
    console.log('Server töötab pordil 3000');
});