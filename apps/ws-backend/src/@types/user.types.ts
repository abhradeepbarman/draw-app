import { WebSocket } from "ws";

interface User {
    userId: string;
    rooms: string[];
    ws: WebSocket;
}

export default User;