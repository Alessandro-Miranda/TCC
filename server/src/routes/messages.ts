import { Router } from 'express';

const messagesRouter = Router();

messagesRouter.get("/", (req, res) => {
    console.log('aqui vai retornar os users');
    res.status(200).json({
        message: "Aqui vai retornar as mensagens trocadas pelo usuário"
    });
});

export { messagesRouter };
