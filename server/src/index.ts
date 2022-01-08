import express from 'express';
import { authRouter, messagesRouter } from './routes';
import { WebSocketServer } from './WebSocketServer';

const server = express();
const PORT = process.env.PORT || 4000;

server.use(express.urlencoded({ extended: false, limit: '50mb' }))
server.use(express.json({ limit: '50mb' }));
server.use('/auth', authRouter);
server.use('/messages', messagesRouter);
server.get('/', (_, res) => res.status(200).send('recebeu'));

const wsServer = new WebSocketServer(server);

wsServer.server.listen(PORT, () => {
    console.log('Server is listening at the port: ', PORT);
});