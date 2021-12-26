import { Router } from 'express';
import { MessageController } from '../controller/MessageController';

const messagesRouter = Router();

messagesRouter.get("/contacts/:email/:department", (req, res) => new MessageController().getContacts(req, res));

export { messagesRouter };

