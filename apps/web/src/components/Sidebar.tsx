import React from "react";
import { Circle, Minus, Square } from "lucide-react";
import { Shape } from "@/@types/shape.types";

const SideBar = ({
    selectedShape,
    setSelectedShape,
}: {
    selectedShape: Shape["type"];
    setSelectedShape: React.Dispatch<React.SetStateAction<Shape["type"]>>;
}) => {
    return (
        <div className="flex justify-center gap-3 bg-blue-900 p-5">
            <div
                onClick={() => setSelectedShape("rect")}
                className={`${selectedShape === "rect" ? "bg-gray-500" : ""}`}
            >
                <Square size={25} />
            </div>
            <div
                onClick={() => setSelectedShape("circle")}
                className={`${selectedShape === "circle" ? "bg-gray-500" : ""}`}
            >
                <Circle size={25} />
            </div>
            <div
                onClick={() => setSelectedShape("line")}
                className={`${selectedShape === "line" ? "bg-gray-500" : ""}`}
            >
                <Minus size={25} />
            </div>
        </div>
    );
};

export default SideBar;
