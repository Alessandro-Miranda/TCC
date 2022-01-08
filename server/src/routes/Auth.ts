import { Router } from 'express';
import { AuthController } from '../controller/AuthController';

const authRouter = Router();

authRouter.post('/', (req, res) => new AuthController().authenticate(req, res));

authRouter.get('/confirm-authentication', (req, res) => new AuthController().confirmAuthentication(req, res));

export { authRouter };

