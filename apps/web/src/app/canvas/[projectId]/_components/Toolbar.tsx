import { Tool } from "@/@types/tools";
import { Draw } from "@/draw/Draw";
import { useKeyboard } from "@/hooks/useKeyboard";
import {
	Circle,
	Eraser,
	Minus,
	MousePointer,
	Pencil,
	Square,
} from "lucide-react";
import React from "react";

const Toolbar = ({
	selectedTool,
	setSelectedTool,
	draw,
}: {
	selectedTool: Tool["type"];
	setSelectedTool: React.Dispatch<React.SetStateAction<Tool["type"]>>;
	draw: Draw | null;
}) => {
	const changeTool = (tool: Tool["type"]) => {
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
			callback: () => changeTool("pencil"),
		},
		{
			shortcuts: ["5"],
			callback: () => changeTool("eraser"),
		},
		{
			shortcuts: ["6"],
			callback: () => changeTool("move"),
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
				className={`cursor-pointer ${selectedTool === "pencil" && "text-blue-500"} relative py-3`}
				onClick={() => changeTool("pencil")}
			>
				<Pencil />
				<span className="absolute bottom-1 -right-2 text-white text-[10px]">
					4
				</span>
			</div>
			<div
				className={`cursor-pointer ${selectedTool === "eraser" && "text-blue-500"} relative py-3`}
				onClick={() => changeTool("eraser")}
			>
				<Eraser />
				<span className="absolute bottom-1 -right-2 text-white text-[10px]">
					5
				</span>
			</div>
			<div
				className={`cursor-pointer ${selectedTool === "move" && "text-blue-500"} relative py-3`}
				onClick={() => changeTool("move")}
			>
				<MousePointer />
				<span className="absolute bottom-1 -right-2 text-white text-[10px]">
					6
				</span>
			</div>
		</div>
	);
};

export default Toolbar;
