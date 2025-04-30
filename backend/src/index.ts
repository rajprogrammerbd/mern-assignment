/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
import process from 'node:process';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './utils/swaggerOptions';
import { kafkaProducer } from '../src/services/kafka.service';
import startKafkaConsumer from '../src/services/kafka.consumer';

// Routes import
import usersRoute from './routes/users.route';
import taskRoute from './routes/task.route';
import { initSocket } from './routes/socket.route';

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

// Middleware Integration
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(helmet());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initialize socket
initSocket(httpServer);

// Routes
app.use('/api/v1/user', usersRoute);
app.use('/api/v1/task', taskRoute);

httpServer.listen(PORT, async () => {
  try {
    await kafkaProducer.connect();
    await startKafkaConsumer();
    console.log(`Kafka Producer connected successfully.`);
    console.log(`Server running at http://kafka:${PORT}`);
  } catch (err) {
    console.error('Failed to connect to Kafka:', err);
    process.exit(1);
  }
});
