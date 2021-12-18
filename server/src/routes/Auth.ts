import { Router } from 'express';
import { AuthController } from '../controller/AuthController';

const authRouter = Router();

authRouter.post('/', (new AuthController()).authenticate);
authRouter.get('/confirm-authentication', (new AuthController()).confirmAuthentication)

export { authRouter };

