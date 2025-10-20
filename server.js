const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    // Send existing players
    socket.broadcast.emit('playerJoined', {
        id: socket.id,
        position: { x: 0, y: 1.8, z: 0 }
    });

    socket.on('move', (data) => {
        socket.broadcast.emit('playerMoved', data);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        socket.broadcast.emit('playerLeft', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});