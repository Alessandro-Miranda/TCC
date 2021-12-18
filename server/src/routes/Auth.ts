import { Router } from 'express';
import { AuthController } from '../controller/AuthController';

const authRouter = Router();

authRouter.post('/', (new AuthController()).post);

export { authRouter };

