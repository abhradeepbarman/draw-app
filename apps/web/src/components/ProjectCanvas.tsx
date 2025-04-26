"use client";
import { Shape } from "@/@types/shape.types";
import SideBar from "@/components/Sidebar";
import initDraw from "@/draw/draw";
import React, { useRef, useEffect, useState } from "react";

const ProjectCanvas = ({ projectId }: { projectId: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState<Shape["type"]>("rect");

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let cleanup: () => void = () => {};
        initDraw(canvas, ctx, selectedShape, projectId).then((fn) => {
            cleanup = fn!;
        });

        return () => {
            if (cleanup) {
                cleanup();
            }
        };
    }, [selectedShape]);

    return (
        <div className="relative flex justify-center">
            <canvas width={2000} height={1000} ref={canvasRef}></canvas>
            <div className="fixed bottom-5">
                <SideBar
                    selectedShape={selectedShape}
                    setSelectedShape={setSelectedShape}
                />
            </div>
        </div>
    );
};

export default ProjectCanvas;
