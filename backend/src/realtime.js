import { Server } from 'socket.io';

export function initRealtime(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // set to your frontend origin in production
      methods: ['GET', 'POST', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}