"use client";
import { useSocket } from "@/hooks/useSocket";
import axiosInstance from "@/lib/axios";
import React, { useEffect, useRef } from "react";

interface Shape {
    type: "rect" | "circle" | "line" | "text";
    startX: number;
    startY: number;
    width: number;
    height: number;
}

const ProjectCanvas = ({ projectId }: { projectId: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { socket } = useSocket();

    let existingShapes: Shape[] = [];

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

        let startX = 0;
        let startY = 0;
        let clicked = false;

        const mouseDownHandler = (e: MouseEvent) => {
            clicked = true;
            var rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
        };

        const mouseMoveHandler = (e: MouseEvent) => {
            if (clicked) {
                var rect = canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;

                const width = endX - startX;
                const height = endY - startY;

                clearCanvas(canvas, ctx);
                ctx.beginPath();
                ctx.rect(startX, startY, width, height);
                ctx.stroke();
            }
        };

        const mouseUpHandler = (e: MouseEvent) => {
            clicked = false;

            var rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;

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
            const messageString = JSON.stringify(message);
            sendShape(messageString).then(() => {
                console.log("shape sent");
            });
            clearCanvas(canvas, ctx);

            socket.send(
                JSON.stringify({
                    type: "chat",
                    roomId: projectId,
                    message,
                })
            );
        };

        canvas.addEventListener("mousedown", mouseDownHandler);
        canvas.addEventListener("mousemove", mouseMoveHandler);
        canvas.addEventListener("mouseup", mouseUpHandler);

        return () => {
            canvas.removeEventListener("mousedown", mouseDownHandler);
            canvas.removeEventListener("mousemove", mouseMoveHandler);
            canvas.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [socket]);

    function clearCanvas(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                ctx.beginPath();
                ctx.rect(shape.startX, shape.startY, shape.width, shape.height);
                ctx.stroke();
            }
        });
    }

    async function getPreviousChats() {
        try {
            const { data } = await axiosInstance.get(`/chat/all/${projectId}`);
            console.log("extracted data", data);
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

    return <canvas width={2000} height={1000} ref={canvasRef}></canvas>;
};

export default ProjectCanvas;
