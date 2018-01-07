const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
let clients = [];
let count=0;

wss.on('connection', function connection(ws) {
    clients.push(ws);
    let id = count++;
    for (client in clients) {
        try {
            clients[client].send(JSON.stringify("hey"));
        } catch (e) {

        }
    }
    ws.on('message', function incoming(message) {

    });
    ws.on('close', function close(ws) {
        delete clients[id];
        console.log('close');
    });
});


server.listen(8098, function listening() {
    console.log('Listening on %d', server.address().port);
});