import { createContext } from 'react';
import { Socket } from 'socket.io-client';

type SocketContextData = {
    socket: Socket | undefined;
};

export const SocketContext = createContext({} as SocketContextData)