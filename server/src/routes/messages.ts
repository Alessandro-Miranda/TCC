import { Router } from 'express';
import { MessageController } from '../controller/MessageController';

const messagesRouter = Router();

const messageController = new MessageController();

messagesRouter.get("/contacts/:username", messageController.getContacts.bind(messageController));

export { messagesRouter };

