const http = require('http');
const fs = require('fs');
const path = require('path');

let vehicles = [];

const server = http.createServer((req, res) => {
    // GET / : Welcome page
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Vehicle Management Web Application</h1>');
    } 
    // GET /vehicles : List of all vehicle records in JSON
    else if (req.method === 'GET' && req.url === '/vehicles') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(vehicles));
    } 
    // GET /about : Application information
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Vehicle Management Web Application using Node.js HTTP module.');
    } 
    // GET /info : Serve static file public/info.html
    else if (req.method === 'GET' && req.url === '/info') {
        fs.readFile(path.join(__dirname, 'public', 'info.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error: Could not read file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // POST /add-vehicle : Add a new vehicle
    else if (req.method === 'POST' && req.url === '/add-vehicle') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsedData = JSON.parse(body);
                const { id, vehicleName, vehicleNumber, type, price } = parsedData;
                
                if (!id || !vehicleName || !vehicleNumber || !type || price === undefined) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Missing required fields' }));
                }
                
                vehicles.push({ id, vehicleName, vehicleNumber, type, price });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Vehicle added successfully', vehicle: parsedData }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON format' }));
            }
        });
    } 
    // Invalid routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});