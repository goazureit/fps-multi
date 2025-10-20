const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }  // Allow all origins for dev
});

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    // Send initial position
    socket.emit('playerJoined', {
        id: socket.id,
        position: { x: 0, y: 1.8, z: 0 }
    });
    
    // Notify others
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});