"use client";
import { useSocket } from "@/hooks/useSocket";
import axiosInstance from "@/lib/axios";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import useDeviceSize from "@/hooks/useDeviceSize";
import { Shape, PencilStrokes } from "@/@types/shape.types";

const ProjectCanvas = ({ projectId }: { projectId: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { socket } = useSocket();
    const [selectedTool, setSelectedTool] = useState<string>("rect");
    const [width, height] = useDeviceSize();

    let existingShapes: Shape[] = [];

    useEffect(() => {
        if (selectedTool === "eraser") {
            document.body.style.cursor = "crosshair";
        } else {
            document.body.style.cursor = "default";
        }
    }, [selectedTool]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (!socket) return;

        getPreviousChats().then((res) => {
            res.length > 0 &&
                res.map((item: any) => {
                    existingShapes.push(JSON.parse(item?.message));
                });

            clearCanvas(canvas, ctx);
        });

        const sendJoinRoom = () => {
            socket.send(
                JSON.stringify({
                    type: "join_room",
                    roomId: projectId,
                })
            );
        };

        if (socket.readyState === WebSocket.OPEN) {
            sendJoinRoom();
        } else {
            socket.addEventListener("open", sendJoinRoom, { once: true });
        }

        socket.onmessage = (e) => {
            const incomingMessage = JSON.parse(e.data);

            if (incomingMessage.type === "chat") {
                existingShapes.push(incomingMessage.message);
                clearCanvas(canvas, ctx);
            }
        };

        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";

        let startX = 0;
        let startY = 0;
        let clicked = false;
        let lastX = 0;
        let lastY = 0;
        let pencilStrokes: PencilStrokes[] = [];

        const mouseDownHandler = (e: MouseEvent) => {
            clicked = true;
            var rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            lastX = startX;
            lastY = startY;
            pencilStrokes = [];
        };

        const mouseMoveHandler = (e: MouseEvent) => {
            if (clicked) {
                var rect = canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;

                if (selectedTool === "rect") {
                    const width = endX - startX;
                    const height = endY - startY;

                    clearCanvas(canvas, ctx);
                    ctx.beginPath();
                    ctx.rect(startX, startY, width, height);
                    ctx.stroke();
                } else if (selectedTool === "circle") {
                    const radius = Math.sqrt(
                        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
                    );

                    clearCanvas(canvas, ctx);
                    ctx.beginPath();
                    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                } else if (selectedTool === "line") {
                    clearCanvas(canvas, ctx);
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                } else if (selectedTool === "pencil") {
                    pencilStrokes.push({
                        type: "pencilStrokes",
                        startX: lastX,
                        startY: lastY,
                        endX,
                        endY,
                    });

                    lastX = endX;
                    lastY = endY;
                    clearCanvas(canvas, ctx);
                    pencilStrokes.map((stroke) => {
                        ctx.beginPath();
                        ctx.moveTo(stroke.startX, stroke.startY);
                        ctx.lineTo(stroke.endX, stroke.endY);
                        ctx.stroke();
                    });
                } else if (selectedTool === "eraser") {
                    // TODO - isPointInStroke()

                    existingShapes.map((shape) => {
                        if (shape.type === "rect") {
                            const myRectPath = new Path2D();
                            myRectPath.rect(
                                shape.startX,
                                shape.startY,
                                shape.width,
                                shape.height
                            );

                            if(
                                ctx.isPointInStroke(myRectPath, endX, endY)
                            ){
                                console.log("erased");
                                existingShapes = existingShapes.filter((s) => s != shape)
                                clearCanvas(canvas, ctx);
                            }
                        }
                    });
                }
            }
        };

        const mouseUpHandler = (e: MouseEvent) => {
            clicked = false;

            var rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;

            if (startX === endX && startY === endY) {
                return;
            }

            if (selectedTool === "rect") {
                const width = endX - startX;
                const height = endY - startY;

                const message: Shape = {
                    type: "rect",
                    startX,
                    startY,
                    width,
                    height,
                };

                existingShapes.push(message);
                clearCanvas(canvas, ctx);
                const messageString = JSON.stringify(message);
                sendShape(messageString).then(() => {
                    console.log("shape sent");
                });

                socket.send(
                    JSON.stringify({
                        type: "chat",
                        roomId: projectId,
                        message,
                    })
                );
            } else if (selectedTool === "circle") {
                const radius = Math.sqrt(
                    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
                );

                const message: Shape = {
                    type: "circle",
                    startX,
                    startY,
                    radius,
                };
                existingShapes.push(message);
                clearCanvas(canvas, ctx);
                const messageString = JSON.stringify(message);
                sendShape(messageString).then(() => {
                    console.log("shape sent");
                });

                socket.send(
                    JSON.stringify({
                        type: "chat",
                        roomId: projectId,
                        message,
                    })
                );
            } else if (selectedTool === "line") {
                const message: Shape = {
                    type: "line",
                    startX,
                    startY,
                    endX,
                    endY,
                };
                existingShapes.push(message);
                clearCanvas(canvas, ctx);
                const messageString = JSON.stringify(message);
                sendShape(messageString).then(() => {
                    console.log("shape sent");
                });

                socket.send(
                    JSON.stringify({
                        type: "chat",
                        roomId: projectId,
                        message,
                    })
                );
            } else if (selectedTool === "pencil") {
                const message: Shape = {
                    type: "pencil",
                    strokes: pencilStrokes,
                };
                existingShapes.push(message);
                clearCanvas(canvas, ctx);

                const messageString = JSON.stringify(message);
                sendShape(messageString).then(() => {
                    console.log("shape sent");
                });

                socket.send(
                    JSON.stringify({
                        type: "chat",
                        roomId: projectId,
                        message,
                    })
                );
            }
        };

        canvas.addEventListener("mousedown", mouseDownHandler);
        canvas.addEventListener("mousemove", mouseMoveHandler);
        canvas.addEventListener("mouseup", mouseUpHandler);

        return () => {
            canvas.removeEventListener("mousedown", mouseDownHandler);
            canvas.removeEventListener("mousemove", mouseMoveHandler);
            canvas.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [socket, selectedTool]);

    function clearCanvas(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                ctx.beginPath();
                ctx.rect(
                    shape.startX,
                    shape.startY,
                    shape?.width!,
                    shape?.height!
                );
                ctx.stroke();
            } else if (shape.type === "circle") {
                ctx.beginPath();
                ctx.arc(
                    shape.startX,
                    shape.startY,
                    shape?.radius!,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
            } else if (shape.type === "line") {
                ctx.beginPath();
                ctx.moveTo(shape.startX, shape.startY);
                ctx.lineTo(shape.endX!, shape.endY!);
                ctx.stroke();
            } else if (shape.type === "pencil") {
                shape.strokes.map((stroke) => {
                    ctx.beginPath();
                    ctx.moveTo(stroke.startX, stroke.startY);
                    ctx.lineTo(stroke.endX, stroke.endY);
                    ctx.stroke();
                });
            }
        });
    }

    async function getPreviousChats() {
        try {
            const { data } = await axiosInstance.get(`/chat/all/${projectId}`);
            return data?.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function sendShape(message: string) {
        try {
            await axiosInstance.post(`/chat/${projectId}`, {
                message,
            });
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="relative">
            <canvas width={width} height={height} ref={canvasRef}></canvas>
            <div className="fixed bottom-5 w-full flex justify-center">
                <Toolbar
                    selectedTool={selectedTool}
                    setSelectedTool={setSelectedTool}
                />
            </div>
        </div>
    );
};

export default ProjectCanvas;
