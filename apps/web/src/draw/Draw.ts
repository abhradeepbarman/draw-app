import { Shape } from "@/@types/shape.types";
import { deleteShapes, getPreviousChats, sendShape } from "@/api";

export class Draw {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private projectId: string;
    private socket: WebSocket;
    private clicked: Boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private deletedShapes: Shape[] = [];
    private selectedTool: Shape["type"] = "rect";
    private toolChangeOnKeyPress: (shape: Shape["type"]) => void;

    constructor(
        canvas: HTMLCanvasElement,
        projectId: string,
        socket: WebSocket,
        toolChangeOnKeyPress: (shape: Shape["type"]) => void
    ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.projectId = projectId;
        this.socket = socket;
        this.init();
        this.initWebsocketHandlers();
        this.initMouseHandlers();
        this.toolChangeOnKeyPress = toolChangeOnKeyPress;
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        window.removeEventListener("keypress", this.keyPressHandler);
    }

    setTool(tool: Shape["type"]) {
        this.selectedTool = tool;
    }

    async init() {
        this.ctx.strokeStyle = "white";
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px arial";

        const res = await getPreviousChats(this.projectId);
        if (res.length > 0) {
            res.map((item: any) => {
                this.existingShapes.push({
                    id: item.id,
                    ...JSON.parse(item?.message),
                });
            });
        }
        this.clearCanvas();
    }

    initWebsocketHandlers() {
        const sendJoinRoom = () => {
            this.socket.send(
                JSON.stringify({
                    type: "join_room",
                    roomId: this.projectId,
                })
            );
        };

        if (this.socket.readyState === WebSocket.OPEN) {
            sendJoinRoom();
        } else {
            this.socket.addEventListener("open", sendJoinRoom, { once: true });
        }

        this.socket.onmessage = (e) => {
            const incomingMessage = JSON.parse(e.data);
            if (incomingMessage.type === "chat") {
                this.existingShapes.push(incomingMessage.message);
                this.clearCanvas();
            } else if (incomingMessage.type === "delete_chat") {
                //TODO: Delete logic Fix
                this.existingShapes = this.existingShapes.filter((shape) => {
                    const { id: idOne, ...restShapeOne } = shape;
                    const { id: idTwo, ...restShapeTwo } =
                        incomingMessage.message;
                    return !this.isMatchingShape(restShapeOne, restShapeTwo);
                });
                this.clearCanvas();
            }
        };
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        window.addEventListener("keypress", this.keyPressHandler);
    }

    mouseDownHandler = async (e: MouseEvent) => {
        this.clicked = true;

        var rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

        this.deletedShapes = [];
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            var rect = this.canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;

            if (this.selectedTool === "rect") {
                const width = endX - this.startX;
                const height = endY - this.startY;

                this.clearCanvas();
                this.ctx.beginPath();
                this.ctx.rect(this.startX, this.startY, width, height);
                this.ctx.stroke();
            } else if (this.selectedTool === "circle") {
                const radius = Math.sqrt(
                    Math.pow(endX - this.startX, 2) +
                        Math.pow(endY - this.startY, 2)
                );

                this.clearCanvas();
                this.ctx.beginPath();
                this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                this.ctx.stroke();
            } else if (this.selectedTool === "line") {
                this.clearCanvas();
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            } else if (this.selectedTool === "eraser") {
                this.existingShapes.forEach((shape) => {
                    let shouldDelete = false;

                    if (shape.type === "rect") {
                        const path = new Path2D();
                        path.rect(
                            shape.startX,
                            shape.startY,
                            shape.width,
                            shape.height
                        );
                        shouldDelete = this.ctx.isPointInPath(path, endX, endY);
                    }

                    if (shape.type === "circle") {
                        const path = new Path2D();
                        path.arc(
                            shape.startX,
                            shape.startY,
                            shape.radius,
                            0,
                            2 * Math.PI
                        );
                        shouldDelete = this.ctx.isPointInPath(path, endX, endY);
                    }

                    if (shape.type === "line") {
                        const path = new Path2D();
                        path.moveTo(shape.startX, shape.startY);
                        path.lineTo(shape.endX, shape.endY);
                        shouldDelete = this.ctx.isPointInStroke(
                            path,
                            endX,
                            endY
                        );
                    }

                    if (shouldDelete) {
                        this.deletedShapes.push(shape);
                        this.existingShapes = this.existingShapes.filter(
                            (s) => s !== shape
                        );
                        this.clearCanvas();

                        this.socket.send(
                            JSON.stringify({
                                type: "delete_chat",
                                roomId: this.projectId,
                                message: shape,
                            })
                        );
                    }
                });
            }
        }
    };

    mouseUpHandler = async (e: MouseEvent) => {
        this.clicked = false;

        var rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        if (this.startX === endX && this.startY === endY) {
            return;
        }

        if (this.selectedTool === "rect") {
            const width = endX - this.startX;
            const height = endY - this.startY;

            const message: Shape = {
                type: "rect",
                startX: this.startX,
                startY: this.startY,
                width,
                height,
            };

            this.existingShapes.push(message);
            this.clearCanvas();
            const messageString = JSON.stringify(message);
            await sendShape(this.projectId, messageString);

            this.socket.send(
                JSON.stringify({
                    type: "chat",
                    roomId: this.projectId,
                    message,
                })
            );
        } else if (this.selectedTool === "circle") {
            const radius = Math.sqrt(
                Math.pow(endX - this.startX, 2) +
                    Math.pow(endY - this.startY, 2)
            );

            const message: Shape = {
                type: "circle",
                startX: this.startX,
                startY: this.startY,
                radius,
            };
            this.existingShapes.push(message);
            this.clearCanvas();
            const messageString = JSON.stringify(message);
            sendShape(this.projectId, messageString).then(() => {
                console.log("shape sent");
            });

            this.socket.send(
                JSON.stringify({
                    type: "chat",
                    roomId: this.projectId,
                    message,
                })
            );
        } else if (this.selectedTool === "line") {
            const message: Shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX,
                endY,
            };
            this.existingShapes.push(message);
            this.clearCanvas();
            const messageString = JSON.stringify(message);
            await sendShape(this.projectId, messageString);

            this.socket.send(
                JSON.stringify({
                    type: "chat",
                    roomId: this.projectId,
                    message,
                })
            );
        } else if (this.selectedTool === "eraser") {
            this.clearCanvas();
            const deletedChats: string[] = [];
            this.deletedShapes.map((shape: Shape) => {
                if (shape?.id) {
                    deletedChats.push(shape.id);
                }
            });
            if (deletedChats.length > 0) {
                await deleteShapes(this.projectId, deletedChats);
            }
        }
    };

    keyPressHandler = (e: KeyboardEvent) => {
        if (e.key === "1") {
            this.setTool("rect");
            this.toolChangeOnKeyPress("rect");
        } else if (e.key === "2") {
            this.setTool("circle");
            this.toolChangeOnKeyPress("circle");
        } else if (e.key === "3") {
            this.setTool("line");
            this.toolChangeOnKeyPress("line");
        } else if (e.key === "4") {
            this.setTool("eraser");
            this.toolChangeOnKeyPress("eraser");
        }
    };

    isMatchingShape(shape: any, target: any) {
        return JSON.stringify(shape) === JSON.stringify(target);
    }

    clearCanvas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.beginPath();
                this.ctx.rect(
                    shape.startX,
                    shape.startY,
                    shape?.width!,
                    shape?.height!
                );
                this.ctx.stroke();
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(
                    shape.startX,
                    shape.startY,
                    shape?.radius!,
                    0,
                    2 * Math.PI
                );
                this.ctx.stroke();
            } else if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX!, shape.endY!);
                this.ctx.stroke();
            }
        });
    }
}
