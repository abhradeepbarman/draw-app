"use client";
import initDraw from "@/draw/draw";
import React, { useEffect, useRef } from "react";

const page = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                return;
            }

            initDraw(canvas, ctx);
        }
    }, [canvasRef]);

    return (
        <div>
            <canvas ref={canvasRef} width={2000} height={1500}></canvas>
        </div>
    );
};

export default page;
