import { useEffect, useState } from "react";

export function useSocket() {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const newWebsocket = new WebSocket(
            `${process.env.NEXT_PUBLIC_WS_BACKEND_URL!}`
        );

        setWs(newWebsocket);
    }, []);

    return { ws, setWs };
}
