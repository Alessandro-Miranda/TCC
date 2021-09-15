import express from 'express';
import { authRouter } from './routes';

const server = express();
const PORT = process.env.PORT || 4000;

server.use(express.urlencoded({ extended: true, limit: '50mb' }))
server.use(express.json({ limit: '50mb' }));
server.use('/auth', authRouter);

server.listen(PORT, () => {
    console.log('Server is listening at the port: ', PORT);
});

export default server;

