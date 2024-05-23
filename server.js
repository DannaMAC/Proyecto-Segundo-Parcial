const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8888;

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/registro') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            const parsedBody = new URLSearchParams(body);
            const data = `Nombre: ${parsedBody.get('nombre')}, Email: ${parsedBody.get('email')}, Mensaje: ${parsedBody.get('mensaje')}\n`;
            fs.appendFile('contacto.txt', data, err => {
                if (err) throw err;
                response.writeHead(302, { 'Location': '/gracias.html' });
                response.end();
            });
        });
        return;
    }

    const filePath = request.url === '/' ? './WWW/index.html' : `./WWW${request.url}`;
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./WWW/404.html', (error, content) => {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end(`Sorry, there was an error: ${error.code} ..\n`);
                response.end();
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
