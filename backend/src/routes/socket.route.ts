/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';
import chalk from 'chalk';
import UserService from "../services/users.services";
import { verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
const socketIoRedis = require('socket.io-redis');

declare module 'socket.io' {
    interface Socket {
      user?: JwtPayload;
    }
}
  

let io: Server;

export function initSocket(httpServer: any) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    }
  });
  
  io.adapter(
    socketIoRedis({
      host: 'redis',
      port: 6379,
    })
  );

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log('this one calls', token);
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
  
    try {
      const decoded = verifyToken(token);
      socket.user = decoded;
  
      console.log(chalk.bgGreen.white('Socket.io'), 'Socket user verified!');
      next();
    } catch (error: unknown) {
      console.log(chalk.bgRed.white("Socket.io"), 'varification failed', error);
      return next(new Error('Authentication error: ' + error));
    }
  });
  
  
  io.on('connection', (socket) => {
    console.log(chalk.bgGreen.white('Socket.io'), 'socket is connected!', socket.id);
    
    socket.on('disconnect', () => {
      console.log(chalk.bgRed.white('Socket.io'), 'socket is disconnected!', socket.id);
    });
  
    socket.on('all_users', async () => {
      const email = socket.user?.email;
  
      const users = await UserService.getUserList(email || '');
      console.log(chalk.bgCyan('Socket.io'), 'all_users');
  
      socket.emit('all_users', users);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
