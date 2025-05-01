"use client";
import { PencilStrokes, Shape } from "@/@types/shape.types";
import { deleteShapes, getPreviousChats, sendShape } from "@/api";
import useDeviceSize from "@/hooks/useDeviceSize";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import { Draw } from "@/draw";

const ProjectCanvas = ({ projectId }: { projectId: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { socket } = useSocket();
    const [selectedTool, setSelectedTool] = useState<Shape["type"]>("rect");
    const [width, height] = useDeviceSize();
    const [draw, setDraw] = useState<Draw | null>(null);

    useEffect(() => {
        draw?.setTool(selectedTool);

        if (selectedTool === "eraser") {
            document.body.style.cursor = "crosshair";
        } else {
            document.body.style.cursor = "default";
        }
    }, [selectedTool, draw]);

    useEffect(() => {
        if (canvasRef.current && socket) {
            const d = new Draw(canvasRef.current, projectId, socket);
            setDraw(d);

            return () => draw?.destroy();
        }
    }, [canvasRef, socket]);

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
