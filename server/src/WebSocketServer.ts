import { Express } from 'express';
import { createServer, Server } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { CONNECTION, DISCONNECT, NEW_MESSAGE } from './constants/constants';
import { IWebSocketServer } from './interfaces/IWebSocketServer';
import { SocketDisconnectReason } from './types/WsServer';

export class WebSocketServer implements IWebSocketServer
{
    public server: Server;
    public io: SocketIoServer;

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

    newMessage(chatID?: string): void
    {
        
    }
    
    disconnect(reason: SocketDisconnectReason): void
    {
        console.log('User disconnected');
    }
}