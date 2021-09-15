import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/', (req, res) => {
    console.log('enviou a req com isso no corpo: ', req.body);
    res.send('ok');
});