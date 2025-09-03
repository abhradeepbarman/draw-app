"use client";
import { Tool } from "@/@types/tools";
import { Draw } from "@/draw/Draw";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";
import useDeviceSize from "@/hooks/useDeviceSize";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import BackButton from "./back-button";
import Toolbar from "./toolbar";

const ProjectCanvas = ({
	projectId,
	redirect,
}: {
	projectId: string;
	redirect: boolean;
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { socket } = useSocket();
	const [selectedTool, setSelectedTool] = useState<Tool["type"]>("rect");
	const [width, height] = useDeviceSize();
	const [draw, setDraw] = useState<Draw | null>(null);

	useEffect(() => {
		draw?.setTool(selectedTool);
	}, [selectedTool, draw]);

	useDebounceEffect(
		() => {
			if (canvasRef.current && socket) {
				const d = new Draw(
					canvasRef.current,
					projectId,
					socket,
					setSelectedTool
				);
				setDraw(d);

				return () => draw?.destroy();
			}
		},
		[canvasRef, socket, width, height],
		300
	);

	return (
		<div className="relative bg-black">
			<canvas
				width={width}
				height={height}
				ref={canvasRef}
				className="overflow-hidden"
			></canvas>
			<div className="fixed bottom-6 w-full flex justify-center">
				<Toolbar
					selectedTool={selectedTool}
					setSelectedTool={setSelectedTool}
					draw={draw}
				/>
			</div>
			<div className="fixed top-5 left-5 z-50">
				<BackButton route="/dashboard" />
			</div>
		</div>
	);
};

export default ProjectCanvas;
