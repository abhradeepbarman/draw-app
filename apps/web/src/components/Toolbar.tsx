import { Shape } from "@/@types/shape.types";
import { Circle, Eraser, Hand, Minus, Pen, Square, TextCursor } from "lucide-react";
import React from "react";

const Toolbar = ({
    selectedTool,
    setSelectedTool,
}: {
    selectedTool: Shape["type"];
    setSelectedTool: React.Dispatch<React.SetStateAction<Shape["type"]>>;
}) => {
    return (
        <div className="flex gap-4">
            <div
                className={`cursor-pointer ${selectedTool === "rect" && "text-blue-500"}`}
                onClick={() => setSelectedTool("rect")}
            >
                <Square />
            </div>
            <div
                className={`cursor-pointer ${selectedTool === "circle" && "text-blue-500"}`}
                onClick={() => setSelectedTool("circle")}
            >
                <Circle />
            </div>
            <div
                className={`cursor-pointer ${selectedTool === "line" && "text-blue-500"}`}
                onClick={() => setSelectedTool("line")}
            >
                <Minus />
            </div>
            <div
                className={`cursor-pointer ${selectedTool === "pencil" && "text-blue-500"}`}
                onClick={() => setSelectedTool("pencil")}
            >
                <Pen />
            </div>
            <div
                className={`cursor-pointer ${selectedTool === "eraser" && "text-blue-500"}`}
                onClick={() => setSelectedTool("eraser")}
            >
                <Eraser />
            </div>
            <div
                className={`cursor-pointer ${selectedTool === "drag" && "text-blue-500"}`}
                onClick={() => setSelectedTool("drag")}
            >
                <Hand />
            </div>
            <div
                className={`cursor-pointer ${selectedTool === "text" && "text-blue-500"}`}
                onClick={() => setSelectedTool("text")}
            >
                <TextCursor />
            </div>
        </div>
    );
};

export default Toolbar;
