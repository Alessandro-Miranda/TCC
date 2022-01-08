import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketDisconnectReason } from '../types/WsServer';

export interface IWebSocketServer
{
    listen(): void;
    connected(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void;
    newMessage(chatID?: string): void;
    disconnect(reason: SocketDisconnectReason): void;
}