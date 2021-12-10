import express, { Application } from 'express';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes';
import config from './config';

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
  }

  public listen = () => {
    this.app.listen(config.PORT, '0.0.0.0', () => {
      const log = console.log
      log('\n')
      log(chalk.bgGreen.black(`Server listening on http://localhost:${config.PORT}/ ..`))
      log('\n')

      log(`${chalk.blue('Much fun! :)')}`)
      log('\n')
    });
    routes(this.app);
  }

  private initializeMiddlewares = () => {
    this.app.use(express.static('public'));
    this.app.use((req, res, next) => {
      req.setTimeout(100000);
      next();
    });
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded());
    this.app.use(bodyParser.json());
  }

  private connectToTheDatabase = () => {
    mongoose.set('useFindAndModify', false);
    mongoose.connect(config.MONGO_URL, { useNewUrlParser: true })
  }
}

new App().listen();
