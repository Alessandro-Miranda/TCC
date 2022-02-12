import React, { FC, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from './src/constants';
import { SocketContext } from './src/contexts/socketContext';
import Routes from './src/routes';

const App: FC = () => {

    const [ socket, setSocket ] = useState<Socket>();

    useEffect(() => {

        const socket = io(BASE_URL);
        
        setSocket(socket);
    }, []);

    return (
        <SocketContext.Provider value={{ socket } }>
            <Routes />
        </SocketContext.Provider>
    )
};

export default App;