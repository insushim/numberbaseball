import React, { createContext, useContext, useRef, useCallback, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@numball/shared';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: TypedSocket | null;
  isConnected: boolean;
  connectionError: string | null;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<TypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Clean up any existing socket before creating a new one
    cleanup();

    setConnectionError(null);

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    }) as TypedSocket;

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        setConnectionError('서버에서 연결을 종료했습니다.');
      }
    });

    socketRef.current.on('connect_error', (error) => {
      setIsConnected(false);
      setConnectionError(error.message || '서버에 연결할 수 없습니다.');
    });

    socketRef.current.io.on('reconnect_failed', () => {
      setConnectionError('재연결에 실패했습니다. 네트워크를 확인해 주세요.');
    });
  }, [cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
    setIsConnected(false);
    setConnectionError(null);
  }, [cleanup]);

  // Clean up socket on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        connectionError,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
