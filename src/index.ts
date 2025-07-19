import { db } from './models/index';
db();

import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

import { setupRoutes } from './routes';
import { setupSocket } from './socket';
import { AppError } from './exceptions/AppError';
import { PORT } from './config/env';
import { ValidationError } from 'express-validation';
import './services/schedulerService';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['POST'] },
});

app.use(cors());
app.use(bodyParser.json());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

setupRoutes(app);

setupSocket(io);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    console.error(`AppError: ${err.message}`);
    err.sendResponse(res);
  } else if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  } else {
    console.error('Unhandled error:', err.message || err);
    res
      .status(err.status || 500)
      .json({ error: err.message || 'Internal Server Error' });
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
