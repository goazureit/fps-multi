const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id, 'at', new Date().toISOString());
    
    socket.emit('playerJoined', {
        id: socket.id,
        position: { x: 0, y: 1.8, z: 0 }
    });
    
    socket.broadcast.emit('playerJoined', {
        id: socket.id,
        position: { x: 0, y: 1.8, z: 0 }
    });

    socket.on('move', (data) => {
        console.log('Move received:', data.id, data.position);
        socket.broadcast.emit('playerMoved', data);
    });

    socket.on('hit', (data) => {
        console.log('Hit received:', data);
        io.emit('hit', data);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        socket.broadcast.emit('playerLeft', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});