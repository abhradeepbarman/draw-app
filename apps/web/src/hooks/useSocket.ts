import { useEffect, useState } from "react";

export function useSocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        try {
            const newWebsocket = new WebSocket(
                `${process.env.NEXT_PUBLIC_WS_BACKEND_URL!}`
            );

            setSocket(newWebsocket);
        } catch (error) {
            console.log(error);
        }
    }, []);

    return { socket, setSocket };
}
