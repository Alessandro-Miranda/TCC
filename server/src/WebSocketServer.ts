import { Express } from 'express';
import { onSnapshot, query, Unsubscribe, where } from 'firebase/firestore';
import { createServer, Server } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import {
    CHATS,
    CONNECTION,
    DISCONNECT,
    MESSAGE,
    MESSAGES,
    NEW_CHAT,
    NEW_MESSAGE
} from './constants';
import { IWebSocketServer } from './interfaces/IWebSocketServer';
import { Database } from './repositories/Database';
import { MessageBody } from './types/Message';
import { SocketDisconnectReason } from './types/WsServer';

type NewMessages = {
    mensagem: MessageBody[];
};

export class WebSocketServer implements IWebSocketServer
{
    public server: Server;
    public io: SocketIoServer;
    static newMessageUnsub: Unsubscribe = () => {};
    static newChatUnsub: Unsubscribe = () => {};
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

        socket.on(NEW_CHAT, (userEmail) => {
            WebSocketServer.newChat(userEmail, socket);
        });

        socket.on(DISCONNECT, (reason) => {
            WebSocketServer.disconnect(reason as SocketDisconnectReason);
        });
    }

    static newMessage(chatID: string, socket: Socket): void
    {
        const db = new Database();
        
        this.newMessageUnsub = onSnapshot(db.getDoc([CHATS, chatID, MESSAGES, MESSAGE]), (doc) => {
            if(doc.exists())
            {
                const messages = doc.data() as NewMessages;
                socket.emit(NEW_MESSAGE, messages.mensagem);
            }
        });
    }

    static async newChat(userEmail: string, socket: Socket): Promise<void>
    {
        const db = new Database();
        const queryToExecute = query(db.getCollectionRef(CHATS), where('users', 'array-contains', userEmail));
        
        this.newChatUnsub = onSnapshot(queryToExecute, async snapshoot => {
            const chatsInfo = await db.getMessagePreview(snapshoot, userEmail);
            
            socket.emit(NEW_CHAT, chatsInfo);
        });
        // this.newChatUnsub = onSnapshot(db.getCollectionRef('chats'), async snapshoot => {
        //     console.log('chegou coisa nova aqui hein');
        //     const chatsInfo = await db.getMessagePreview(snapshoot, userEmail);
            
        //     socket.emit(NEW_CHAT, chatsInfo);
        // });
    }
    
    static disconnect(reason: SocketDisconnectReason): void
    {
        console.log('User disconnected. Reason: ', reason);
        this.newMessageUnsub();
        this.newChatUnsub();
    }
}