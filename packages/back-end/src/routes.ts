import { Application, Request, Express } from 'express';
import UserController from './controllers/UserController';

const routes = (app: Application) => {
  const userCtrl = new UserController();

  app.get('/', (req: any, res: any) => {
    res.send(`Api server in running (${new Date()})`)
  })

  // Auth Routes
  app.post('/account/getSignMessage', userCtrl.getSignMessage);
  app.post('/account/auth', userCtrl.auth);
}

export default routes;
