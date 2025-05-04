import { PencilStrokes, Shape } from "@/@types/shape.types";
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
    private lastX: number = 0;
    private lastY: number = 0;
    private pencilStrokes: PencilStrokes[] = [];
    private deletedShapes: Shape[] = [];
    private selectedTool: Shape["type"] = "rect";
    private previousX: number = 0;
    private previousY: number = 0;
    private viewportTransform = {
        x: 0,
        y: 0,
        scale: 1,
    };

    constructor(
        canvas: HTMLCanvasElement,
        projectId: string,
        socket: WebSocket
    ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.projectId = projectId;
        this.socket = socket;
        this.init();
        this.initWebsocketHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("wheel", this.mouseWheelHandler);
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
                this.existingShapes = this.existingShapes.filter((shape) => {
                    const { id: idOne, ...restShapeOne } = shape;
                    const { id: idTwo, ...restShapeTwo } =
                        incomingMessage.message;
                    return !this.isMatchingShape(restShapeOne, restShapeTwo);
                });
                this.clearCanvas();
            } else if (incomingMessage.type === "drag") {
                this.viewportTransform = {
                    ...incomingMessage.viewportTransform,
                };
                this.clearCanvas();
            }
        };
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("wheel", this.mouseWheelHandler);
        window.addEventListener("keypress", this.keyPressHandler);
    }

    updatePanning = (e: MouseEvent) => {
        const localX = e.clientX;
        const localY = e.clientY;

        this.viewportTransform.x += localX - this.previousX;
        this.viewportTransform.y += localY - this.previousY;

        this.previousX = localX;
        this.previousY = localY;
    };

    updateZooming = (e: WheelEvent) => {
        const oldScale = this.viewportTransform.scale;
        const delta = e.deltaY * -0.01;
        const newScale = Math.max(0.1, Math.min(oldScale + delta, 10));

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleRatio = newScale / oldScale;

        this.viewportTransform.x =
            mouseX - (mouseX - this.viewportTransform.x) * scaleRatio;
        this.viewportTransform.y =
            mouseY - (mouseY - this.viewportTransform.y) * scaleRatio;
        this.viewportTransform.scale = newScale;
    };

    mouseWheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        this.updateZooming(e);

        this.socket.send(
            JSON.stringify({
                type: "drag",
                roomId: this.projectId,
                viewportTransform: { ...this.viewportTransform },
            })
        );
        this.clearCanvas();
    };

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;

        var rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

        this.lastX = this.startX;
        this.lastY = this.startY;

        this.previousX = e.clientX;
        this.previousY = e.clientY;

        this.pencilStrokes = [];
        this.deletedShapes = [];
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            var rect = this.canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;

            const { x: newStartX, y: newStartY } = this.toCanvasCoords(
                this.startX,
                this.startY
            );
            const { x: newEndX, y: newEndY } = this.toCanvasCoords(endX, endY);

            if (this.selectedTool === "rect") {
                const width = newEndX - newStartX;
                const height = newEndY - newStartY;

                this.clearCanvas();
                this.ctx.beginPath();
                this.ctx.rect(newStartX, newStartY, width, height);
                this.ctx.stroke();
            } else if (this.selectedTool === "circle") {
                const radius = Math.sqrt(
                    Math.pow(newEndX - newStartX, 2) +
                        Math.pow(newEndY - newStartY, 2)
                );

                this.clearCanvas();
                this.ctx.beginPath();
                this.ctx.arc(newStartX, newStartY, radius, 0, 2 * Math.PI);
                this.ctx.stroke();
            } else if (this.selectedTool === "line") {
                this.clearCanvas();
                this.ctx.beginPath();
                this.ctx.moveTo(newStartX, newStartY);
                this.ctx.lineTo(newEndX, newEndY);
                this.ctx.stroke();
            } else if (this.selectedTool === "pencil") {
                const { x: newLastX, y: newLastY } = this.toCanvasCoords(
                    this.lastX,
                    this.lastY
                );

                this.pencilStrokes.push({
                    type: "pencilStrokes",
                    startX: newLastX,
                    startY: newLastY,
                    endX: newEndX,
                    endY: newEndY,
                });

                this.lastX = endX;
                this.lastY = endY;
                this.clearCanvas();
                this.pencilStrokes.map((stroke) => {
                    this.ctx.beginPath();
                    this.ctx.moveTo(stroke.startX, stroke.startY);
                    this.ctx.lineTo(stroke.endX, stroke.endY);
                    this.ctx.stroke();
                });
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

                    if (shape.type === "pencil") {
                        for (let i = 0; i < shape.strokes.length - 1; i++) {
                            const p1 = shape.strokes[i];
                            const p2 = shape.strokes[i + 1];
                            const path = new Path2D();
                            path.moveTo(p1.startX, p1.startY);
                            path.lineTo(p2.startX, p2.startY);

                            if (this.ctx.isPointInStroke(path, endX, endY)) {
                                shouldDelete = true;
                                break;
                            }
                        }
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
            } else if (this.selectedTool === "drag") {
                this.updatePanning(e);
                this.clearCanvas();

                this.socket.send(
                    JSON.stringify({
                        type: "drag",
                        roomId: this.projectId,
                        viewportTransform: { ...this.viewportTransform },
                    })
                );
            }
        }
    };

    mouseUpHandler = async (e: MouseEvent) => {
        this.clicked = false;

        var rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const { x: newStartX, y: newStartY } = this.toCanvasCoords(
            this.startX,
            this.startY
        );
        const { x: newEndX, y: newEndY } = this.toCanvasCoords(endX, endY);

        if (this.startX === endX && this.startY === endY) {
            return;
        }

        if (this.selectedTool === "rect") {
            const width = newEndX - newStartX;
            const height = newEndY - newStartY;

            const message: Shape = {
                type: "rect",
                startX: newStartX,
                startY: newStartY,
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
                Math.pow(newEndX - newStartX, 2) +
                    Math.pow(newEndY - newStartY, 2)
            );

            const message: Shape = {
                type: "circle",
                startX: newStartX,
                startY: newStartY,
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
                startX: newStartX,
                startY: newStartY,
                endX: newEndX,
                endY: newEndY,
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
        } else if (this.selectedTool === "pencil") {
            const message: Shape = {
                type: "pencil",
                strokes: this.pencilStrokes,
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
        // if (this.isTyping) {
        //     this.typeShape.text += e.key;

        //     const { x, y } = this.toCanvasCoords(
        //         this.typeShape.startX,
        //         this.typeShape.startY
        //     );

        //     this.ctx.beginPath();
        //     this.ctx.fillText(this.typeShape.text, x, y);
        //     this.ctx.strokeText(this.typeShape.text, x, y);
        //     this.clearCanvas();
        // }
    };

    isMatchingShape(shape: any, target: any) {
        return JSON.stringify(shape) === JSON.stringify(target);
    }

    clearCanvas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(
            this.viewportTransform.scale,
            0,
            0,
            this.viewportTransform.scale,
            this.viewportTransform.x,
            this.viewportTransform.y
        );

        this.ctx.lineWidth = 1 / this.viewportTransform.scale;

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
            } else if (shape.type === "pencil") {
                shape.strokes.map((stroke) => {
                    this.ctx.beginPath();
                    this.ctx.moveTo(stroke.startX, stroke.startY);
                    this.ctx.lineTo(stroke.endX, stroke.endY);
                    this.ctx.stroke();
                });
            }
        });
    }

    toCanvasCoords(x: number, y: number) {
        return {
            x: (x - this.viewportTransform.x) / this.viewportTransform.scale,
            y: (y - this.viewportTransform.y) / this.viewportTransform.scale,
        };
    }
}
