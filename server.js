const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');
require('dotenv').config();

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', ({ eventId }) => {
    socket.join(eventId);
  });

  socket.on('sendAnnouncement', async ({ eventId, content }) => {
    if (socket.user.role !== 'admin') return;

    const message = await Message.create({
      sender: socket.user.userId,
      event: eventId,
      content
    });

    io.to(eventId).emit('newAnnouncement', message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});