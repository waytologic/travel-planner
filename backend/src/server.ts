import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import favicon from 'serve-favicon';
import path from 'path';
import Logging from './library/Logging';
import UserRoutes from './routes/UserRoutes';
import TripRoutes from './routes/tripRoutes';

const router = express();

/** Connect to Mongo */
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info(`Connected to mongoDB.`);
    startServer();
  })
  .catch((err) => {
    Logging.error('Unable to connect.');
    Logging.info(err);
  });

/** Only start the server if Mongo Connects */
const startServer = () => {
  router.use((req, res, next) => {
    /** Log the Request */
    Logging.info(`incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
      /** Log the Response */
      Logging.info(`incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /** Rules of our API */
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  router.use('/api', UserRoutes);
  router.use('/travel', TripRoutes);
  //router.use('/travel', TravelRoutes);

  // Specify the path to your favicon
  router.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  // router.get('/favicon.ico', (req, res) => res.status(204));

  /** Healthcheck */
  router.get('/', (req, res, next) => res.status(200).json({ message: 'Welcome to AppStorez' }));
  router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

  // Serve Swagger API docs
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  /** Error handling */
  router.use((req, res, next) => {
    const error = new Error('not found');
    Logging.error(error);
    return res.status(400).json({ message: error.message });
  });

  http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}.`));
};
