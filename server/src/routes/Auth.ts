import { Router } from 'express';
import { AuthController } from '../controller/AuthController';

const authRouter = Router();

const authController = new AuthController();

authRouter.post('/', authController.authenticate.bind(authController));
authRouter.get('/confirm-authentication', authController.confirmAuthentication.bind(authController));

export { authRouter };

