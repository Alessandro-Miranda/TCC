import { Express } from 'express';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { createServer, Server } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { firestoreApp } from './config/firebaseConfig';
import { CONNECTION, DISCONNECT, NEW_MESSAGE } from './constants/constants';
import { IWebSocketServer } from './interfaces/IWebSocketServer';
import { MessageBody } from './types/Message';
import { SocketDisconnectReason } from './types/WsServer';

export class WebSocketServer implements IWebSocketServer
{
    public server: Server;
    public io: SocketIoServer;
    public unsub: Unsubscribe = () => {};
    public newMessages: MessageBody[] = [];

    constructor(server: Express)
    {
        this.server = createServer(server);
        this.io = new SocketIoServer(this.server);
        this.listen();
    }

    listen(): void
    {
        this.io.on(CONNECTION, this.connected);
        this.io.on(NEW_MESSAGE, this.newMessage);
        this.io.on(DISCONNECT, this.disconnect);
    }

    connected(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void
    {
        // Aqui vai o status de usuário online
        console.log('New user connected')
    }

    newMessage(chatID?: string, userEmail?: string): void
    {
        if(!chatID && userEmail)
        {
            this.getAllMessages(userEmail);
        }
        else if(chatID)
        {
            this.unsub = onSnapshot(doc(firestoreApp, 'chats', chatID), (doc) => {
                this.newMessages.push(doc.data() as MessageBody);
                this.io.emit(NEW_MESSAGE, this.newMessages);
            });
        }
    }

    getAllMessages(userEmail: string): void
    {
        
    }
    
    disconnect(reason: SocketDisconnectReason): void
    {
        console.log('User disconnected');
        this.unsub();
    }
}