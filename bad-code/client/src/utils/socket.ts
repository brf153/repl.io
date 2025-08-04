import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";

function useSocket(replId: string) {
    const [socket, setSocket] = useState<typeof Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`${import.meta.env.VITE_WS_URL}?roomId=${replId}`);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [replId]);

    return socket;
}

export default useSocket;