const express = require('express');
const http = require('http');
const WebScokets = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app)
const wss = new WebScokets.Server({ server });

let document = "";

wss.on('connection', (ws) => {
    console.log('New client connected');


    ws.send(JSON.stringify({ type: 'init', data: document }));

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'update') {
                document = parsedMessage.data;

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'update', data: document }));
                    }
                });
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
