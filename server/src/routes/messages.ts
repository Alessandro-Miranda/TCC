import { Router } from 'express';
import { MessageController } from '../controller/MessageController';

const messagesRouter = Router();

messagesRouter.get("/contacts/:email/:department", (req, res) => new MessageController().getContacts(req, res));

messagesRouter.post("/create-chat", (req, res) => new MessageController().createChat(req, res));

messagesRouter.post("/send", (req, res) => new MessageController().sendMessage(req, res));

export { messagesRouter };

