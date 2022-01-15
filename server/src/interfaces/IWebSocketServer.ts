import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export interface IWebSocketServer
{
    listen(): void;
    connected(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void;
    getAllMessages(userEmail: string): void;
}