"use client";
import { Shape } from "@/@types/shapes";
import { Draw } from "@/draw/Draw";
import useDeviceSize from "@/hooks/useDeviceSize";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";

const ProjectCanvas = ({ projectId }: { projectId: string }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { socket } = useSocket();
	const [selectedTool, setSelectedTool] = useState<Shape["type"]>("rect");
	const [width, height] = useDeviceSize();
	const [draw, setDraw] = useState<Draw | null>(null);

	useEffect(() => {
		draw?.setTool(selectedTool);
	}, [selectedTool, draw]);

	useEffect(() => {
		if (canvasRef.current && socket) {
			const d = new Draw(canvasRef.current, projectId, socket);
			setDraw(d);

			return () => draw?.destroy();
		}
	}, [canvasRef, socket, width, height]);

	return (
		<div className="relative bg-black">
			<canvas
				width={width}
				height={height}
				ref={canvasRef}
				className="overflow-hidden"
			></canvas>
			<div className="fixed bottom-5 w-full flex justify-center">
				<Toolbar
					selectedTool={selectedTool}
					setSelectedTool={setSelectedTool}
					draw={draw}
				/>
			</div>
		</div>
	);
};

export default ProjectCanvas;
