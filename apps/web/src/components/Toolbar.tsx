import { Shape } from "@/@types/shapes";
import { Circle, Eraser, Minus, Pen, Square, TextCursor } from "lucide-react";
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
                className={`cursor-pointer ${selectedTool === "eraser" && "text-blue-500"}`}
                onClick={() => setSelectedTool("eraser")}
            >
                <Eraser />
            </div>
        </div>
    );
};

export default Toolbar;
