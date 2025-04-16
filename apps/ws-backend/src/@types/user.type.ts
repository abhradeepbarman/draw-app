import { WebSocket } from "ws";

interface User {
    userId: string;
    room: string[];
    ws: WebSocket;
}

export default User;
