import { Shape } from "@/@types/shape.types";
import { Circle, Eraser, Hand, Minus, Pen, Square } from "lucide-react";
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
                className="cursor-pointer"
                onClick={() => setSelectedTool("rect")}
            >
                <Square />
            </div>
            <div
                className="cursor-pointer"
                onClick={() => setSelectedTool("circle")}
            >
                <Circle />
            </div>
            <div
                className="cursor-pointer"
                onClick={() => setSelectedTool("line")}
            >
                <Minus />
            </div>
            <div
                className="cursor-pointer"
                onClick={() => setSelectedTool("pencil")}
            >
                <Pen />
            </div>
            <div
                className="cursor-pointer"
                onClick={() => setSelectedTool("eraser")}
            >
                <Eraser />
            </div>
            <div
                className="cursor-pointer"
                onClick={() => setSelectedTool("drag")}
            >
                <Hand />
            </div>
        </div>
    );
};

export default Toolbar;
