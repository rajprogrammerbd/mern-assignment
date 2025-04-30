/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';
import chalk from 'chalk';
import UserService from '../services/users.services';
import { verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import TaskService from '../services/task.service';
const socketIoRedis = require('socket.io-redis');

declare module 'socket.io' {
  interface Socket {
    user?: JwtPayload;
  }
}

let io: Server;

/**
 * @swagger
 * components:
 *   schemas:
 *     WebSocketEvent:
 *       type: object
 *       properties:
 *         event:
 *           type: string
 *           description: The event name
 *           example: "all_users"
 *         data:
 *           type: object
 *           description: The event data
 *
 *     WebSocketAuth:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: JWT access token for authentication
 */

/**
 * Initializes Socket.IO server with Redis adapter and authentication
 * @param httpServer HTTP server instance to attach Socket.IO to
 */
export function initSocket(httpServer: any) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  io.adapter(
    socketIoRedis({
      host: 'redis',
      port: 6379,
    })
  );

  /**
   * Socket.IO middleware for authentication
   */
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    console.log('this one calls', token);
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = await verifyToken(token);
      socket.user = decoded;

      console.log(chalk.bgGreen.white('Socket.io'), 'Socket user verified!');
      next();
    } catch (error: any) {
      console.log(chalk.bgRed.white('Socket.io'), 'varification failed', error);
      return next(
        new Error('Authentication error: ' + (error.message || 'Unknown error'))
      );
    }
  });

  /**
   * Handles Socket.IO connections and events
   */
  io.on('connection', (socket) => {
    console.log(
      chalk.bgGreen.white('Socket.io'),
      'socket is connected!',
      socket.id
    );

    socket.on('disconnect', () => {
      console.log(
        chalk.bgRed.white('Socket.io'),
        'socket is disconnected!',
        socket.id
      );
    });

    /**
     * @swagger
     * /socket.io/:
     *   websocket:
     *     tags: [WebSocket]
     *     description: Real-time communication channel
     *     security:
     *       - bearerAuth: []
     *     events:
     *       all_users:
     *         description: Request all users list
     *         response:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/User'
     *       all-tasks:
     *         description: Request all tasks list
     *         response:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/Task'
     *       all-task-history:
     *         description: Request all task history
     *         response:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/TaskHistory'
     */
    socket.on('all_users', async () => {
      const users = await UserService.getUserList();
      console.log(chalk.bgCyan('Socket.io'), 'all_users');

      socket.emit('all_users', users);
    });

    socket.on('all-tasks', async () => {
      const tasks = await TaskService.getAllTasks();

      socket.emit('all-tasks', tasks);
    });

    socket.on('all-task-history', async () => {
      const tasks = await TaskService.getAllTaskHistory();

      socket.emit('all-task-history', tasks);
    });
  });
}

/**
 * Gets the initialized Socket.IO instance
 * @returns {Server} The Socket.IO server instance
 * @throws {Error} If Socket.IO is not initialized
 */
export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
