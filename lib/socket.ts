import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeSocket(): Socket {
    if (socket && socket.connected) {
        return socket;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://apexsim-backend.onrender.com';
    socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        transports: ['websocket'],
        upgrade: false,
    });

    socket.on('connect', () => {
        console.log('✅ Connected to Socket.io server');
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.io server');
    });

    socket.on('error', (error: any) => {
        console.error('❌ Socket error:', error);
    });

    return socket;
}

export function getSocket(): Socket | null {
    return socket;
}

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
