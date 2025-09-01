import { Shape } from "@/@types/shapes";
import { Draw } from "@/draw/Draw";
import { useKeyboard } from "@/hooks/useKeyboard";
import { Circle, Eraser, Minus, Square, Type } from "lucide-react";
import React from "react";

const Toolbar = ({
	selectedTool,
	setSelectedTool,
	draw,
}: {
	selectedTool: Shape["type"];
	setSelectedTool: React.Dispatch<React.SetStateAction<Shape["type"]>>;
	draw: Draw | null;
}) => {
	const changeTool = (tool: Shape["type"]) => {
		setSelectedTool(tool);
		draw?.setTool(tool);
	};

	useKeyboard([
		{
			shortcuts: ["1"],
			callback: () => changeTool("rect"),
		},
		{
			shortcuts: ["2"],
			callback: () => changeTool("circle"),
		},
		{
			shortcuts: ["3"],
			callback: () => changeTool("line"),
		},
		{
			shortcuts: ["4"],
			callback: () => changeTool("eraser"),
		},
	]);

	return (
		<div className="flex gap-5 gap-x-7 bg-neutral-700 text-white px-5 rounded-xl border border-neutral-500">
			<div
				className={`cursor-pointer ${selectedTool === "rect" && "text-blue-500"} relative py-3`}
				onClick={() => changeTool("rect")}
			>
				<Square />
				<span className="absolute bottom-1 -right-2 text-white text-[10px]">
					1
				</span>
			</div>
			<div
				className={`cursor-pointer ${selectedTool === "circle" && "text-blue-500"} relative py-3`}
				onClick={() => changeTool("circle")}
			>
				<Circle />
				<span className="absolute bottom-1 -right-2 text-white text-[10px]">
					2
				</span>
			</div>
			<div
				className={`cursor-pointer ${selectedTool === "line" && "text-blue-500"} relative py-3`}
				onClick={() => changeTool("line")}
			>
				<Minus />
				<span className="absolute bottom-1 -right-2 text-white text-[10px]">
					3
				</span>
			</div>
			<div
				className={`cursor-pointer ${selectedTool === "eraser" && "text-blue-500"} relative py-3`}
				onClick={() => changeTool("eraser")}
			>
				<Eraser />
				<span className="absolute bottom-1 -right-2 text-white text-[10px]">
					4
				</span>
			</div>
		</div>
	);
};

export default Toolbar;
