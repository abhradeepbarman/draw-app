"use client";
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

    const existingShapes: Shape[] = [];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

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

            existingShapes.push({
                type: "rect",
                startX,
                startY,
                width,
                height,
            });
            clearCanvas(canvas, ctx);
        };

        canvas.addEventListener("mousedown", mouseDownHandler);
        canvas.addEventListener("mousemove", mouseMoveHandler);
        canvas.addEventListener("mouseup", mouseUpHandler);

        return () => {
            canvas.removeEventListener("mousedown", mouseDownHandler);
            canvas.removeEventListener("mousemove", mouseMoveHandler);
            canvas.removeEventListener("mouseup", mouseUpHandler);
        };
    }, []);

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

    return <canvas width={2000} height={1000} ref={canvasRef}></canvas>;
};

export default ProjectCanvas;
