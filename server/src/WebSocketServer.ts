import { Express } from 'express';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { createServer, Server } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { firestoreApp } from './config/firebaseConfig';
import { CONNECTION, DISCONNECT, NEW_MESSAGE } from './constants/constants';
import { IWebSocketServer } from './interfaces/IWebSocketServer';
import { MessageBody } from './types/Message';
import { SocketDisconnectReason } from './types/WsServer';

type NewMessages = {
    mensagem: MessageBody[];
};

export class WebSocketServer implements IWebSocketServer
{
    public server: Server;
    public io: SocketIoServer;
    static unsub: Unsubscribe = () => {};
    public messages: MessageBody[] = [];
    
    constructor(server: Express)
    {
        this.server = createServer(server);
        this.io = new SocketIoServer(this.server);
        this.listen();
    }

    listen(): void
    {
        this.io.on(CONNECTION, this.connected);
    }

    connected(socket: Socket): void
    {
        console.log('New user connected');
        socket.on(NEW_MESSAGE, (chatID) => {
            WebSocketServer.newMessage(chatID, socket);
        });

        socket.on(DISCONNECT, (reason) => {
            WebSocketServer.disconnect(reason as SocketDisconnectReason);
        });
    }

    static newMessage(chatID: string, socket: Socket): void
    {
        this.unsub = onSnapshot(doc(firestoreApp, 'chats', chatID, 'mensagens', 'mensagem'), (doc) => {
            if(doc.exists())
            {
                const messages = doc.data() as NewMessages;
                socket.emit(NEW_MESSAGE, messages.mensagem);
            }
        });
    }

    getAllMessages(userEmail: string): void
    {
        
    }
    
    static disconnect(reason: SocketDisconnectReason): void
    {
        console.log('User disconnected');
        this.unsub();
    }
}