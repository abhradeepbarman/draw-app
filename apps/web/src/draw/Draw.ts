import { Shape } from "@/@types/shapes";
import { deleteShapes, getPreviousChats, sendShape } from "@/apis";
import { v4 as uuidv4 } from "uuid";

export class Draw {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private existingShapes: Shape[];
	private projectId: string;
	private socket: WebSocket;
	private clicked: Boolean = false;
	private startX: number = 0;
	private startY: number = 0;
	private pencilStrokes: {
		x: number;
		y: number;
	}[] = [];
	private deletedShapes: Shape[] = [];
	private selectedTool: Shape["type"] = "rect";

	constructor(canvas: HTMLCanvasElement, projectId: string, socket: WebSocket) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.existingShapes = [];
		this.projectId = projectId;
		this.socket = socket;
		this.init();
		this.initWebsocketHandlers();
		this.initEventHandlers();
	}

	destroy() {
		this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
		this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
		this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
	}

	setTool(tool: Shape["type"]) {
		this.selectedTool = tool;
	}

	async init() {
		this.ctx.strokeStyle = "white";
		this.ctx.fillStyle = "white";
		this.ctx.lineWidth = 2;

		const res = await getPreviousChats(this.projectId);
		if (res.length > 0) {
			res.map((item: any) => {
				this.existingShapes.push({
					id: item.id,
					...JSON.parse(item?.message),
				});
			});
		}
		this.clearCanvas();
	}

	initWebsocketHandlers() {
		const sendJoinRoom = () => {
			this.socket.send(
				JSON.stringify({
					type: "join_room",
					roomId: this.projectId,
				})
			);
		};

		if (this.socket.readyState === WebSocket.OPEN) {
			sendJoinRoom();
		} else {
			this.socket.addEventListener("open", sendJoinRoom, { once: true });
		}

		this.socket.onmessage = (e) => {
			const incomingMessage = JSON.parse(e.data);
			if (incomingMessage.type === "chat") {
				this.existingShapes.push(incomingMessage.message);
				this.clearCanvas();
			} else if (incomingMessage.type === "delete_chat") {
				this.existingShapes = this.existingShapes.filter(
					(shape) => !incomingMessage.message.includes(shape.id)
				);
				this.clearCanvas();
			}
		};
	}

	initEventHandlers() {
		this.canvas.addEventListener("mousedown", this.mouseDownHandler);
		this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
		this.canvas.addEventListener("mouseup", this.mouseUpHandler);
	}

	mouseDownHandler = async (e: MouseEvent) => {
		this.clicked = true;

		var rect = this.canvas.getBoundingClientRect();
		this.startX = e.clientX - rect.left;
		this.startY = e.clientY - rect.top;

		this.deletedShapes = [];
		this.pencilStrokes = [];

		if (this.selectedTool === "pencil") {
			this.pencilStrokes.push({
				x: this.startX,
				y: this.startY,
			});
		}
	};

	mouseMoveHandler = (e: MouseEvent) => {
		if (this.clicked) {
			var rect = this.canvas.getBoundingClientRect();
			const endX = e.clientX - rect.left;
			const endY = e.clientY - rect.top;

			if (this.selectedTool === "rect") {
				const width = endX - this.startX;
				const height = endY - this.startY;

				this.clearCanvas();
				this.ctx.beginPath();
				this.ctx.rect(this.startX, this.startY, width, height);
				this.ctx.stroke();
			} else if (this.selectedTool === "circle") {
				const radius =
					Math.sqrt(
						Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
					) / 2;

				const centerX = this.startX + radius;
				const centerY = this.startY + radius;

				this.clearCanvas();
				this.ctx.beginPath();
				this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
				this.ctx.stroke();
			} else if (this.selectedTool === "line") {
				this.clearCanvas();
				this.ctx.beginPath();
				this.ctx.moveTo(this.startX, this.startY);
				this.ctx.lineTo(endX, endY);
				this.ctx.stroke();
			} else if (this.selectedTool === "eraser") {
				this.existingShapes.forEach((shape) => {
					if (this.isWithinElement(endX, endY, shape)) {
						this.deletedShapes.push(shape);
						this.existingShapes = this.existingShapes.filter(
							(s) => s.id !== shape.id
						);
						this.clearCanvas();
						this.drawDeletedShape(shape);
					}
				});
			} else if (this.selectedTool === "pencil") {
				this.pencilStrokes.push({
					x: endX,
					y: endY,
				});

				this.pencilStrokes.map((stroke, index) => {
					if (index >= 1) {
						this.ctx.beginPath();
						this.ctx.moveTo(
							this.pencilStrokes[index - 1].x,
							this.pencilStrokes[index - 1].y
						);
						this.ctx.lineTo(
							this.pencilStrokes[index].x,
							this.pencilStrokes[index].y
						);
						this.ctx.stroke();
					}
				});
			}
		}
	};

	mouseUpHandler = async (e: MouseEvent) => {
		this.clicked = false;

		var rect = this.canvas.getBoundingClientRect();
		const endX = e.clientX - rect.left;
		const endY = e.clientY - rect.top;
		const id = uuidv4();

		if (this.startX === endX && this.startY === endY) {
			return;
		}

		if (this.selectedTool === "rect") {
			const width = endX - this.startX;
			const height = endY - this.startY;

			const message: Shape = {
				id,
				type: "rect",
				startX: this.startX,
				startY: this.startY,
				width,
				height,
			};

			this.existingShapes.push(message);
			console.log("shapes", this.existingShapes);
			this.clearCanvas();
			const messageString = JSON.stringify(message);
			await sendShape(this.projectId, messageString);

			this.socket.send(
				JSON.stringify({
					type: "chat",
					roomId: this.projectId,
					message,
				})
			);
		} else if (this.selectedTool === "circle") {
			const radius =
				Math.sqrt(
					Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
				) / 2;

			const centerX = this.startX + radius;
			const centerY = this.startY + radius;

			const message: Shape = {
				id,
				type: "circle",
				startX: centerX,
				startY: centerY,
				radius,
			};
			this.existingShapes.push(message);
			this.clearCanvas();
			const messageString = JSON.stringify(message);
			sendShape(this.projectId, messageString).then(() => {
				console.log("shape sent");
			});

			this.socket.send(
				JSON.stringify({
					type: "chat",
					roomId: this.projectId,
					message,
				})
			);
		} else if (this.selectedTool === "line") {
			const message: Shape = {
				id,
				type: "line",
				startX: this.startX,
				startY: this.startY,
				endX,
				endY,
			};
			this.existingShapes.push(message);
			this.clearCanvas();
			const messageString = JSON.stringify(message);
			await sendShape(this.projectId, messageString);

			this.socket.send(
				JSON.stringify({
					type: "chat",
					roomId: this.projectId,
					message,
				})
			);
		} else if (this.selectedTool === "eraser") {
			const deletedChats: string[] = [];
			this.deletedShapes.forEach((shape: Shape) => {
				deletedChats.push(shape.id);
			});

			if (deletedChats.length > 0) {
				this.existingShapes = this.existingShapes.filter(
					(shape) => !deletedChats.includes(shape.id)
				);
				await deleteShapes(this.projectId, deletedChats);
				this.socket.send(
					JSON.stringify({
						type: "delete_chat",
						roomId: this.projectId,
						message: deletedChats,
					})
				);
			}
			this.clearCanvas();
		} else if (this.selectedTool === "pencil") {
			const message: Shape = {
				id,
				type: "pencil",
				strokes: this.pencilStrokes,
			};

			this.existingShapes.push(message);
			this.clearCanvas();
			const messageString = JSON.stringify(message);
			await sendShape(this.projectId, messageString);

			this.socket.send(
				JSON.stringify({
					type: "chat",
					roomId: this.projectId,
					message,
				})
			);
		}
	};

	isWithinElement = (x: number, y: number, shape: Shape) => {
		switch (shape.type) {
			case "rect":
				const path = new Path2D();
				path.rect(shape.startX, shape.startY, shape.width, shape.height);
				return this.ctx.isPointInPath(path, x, y);
			case "circle":
				const circlePath = new Path2D();
				circlePath.arc(
					shape.startX,
					shape.startY,
					shape.radius,
					0,
					2 * Math.PI
				);
				return this.ctx.isPointInPath(circlePath, x, y);
			case "line":
				const linePath = new Path2D();
				linePath.moveTo(shape.startX, shape.startY);
				linePath.lineTo(shape.endX, shape.endY);
				this.ctx.lineWidth = 2;
				return this.ctx.isPointInStroke(linePath, x, y);
			case "pencil":
				this.ctx.save();
				for (let i = 1; i < shape.strokes.length; i++) {
					const linePath = new Path2D();
					linePath.moveTo(shape.strokes[i - 1].x, shape.strokes[i - 1].y);
					linePath.lineTo(shape.strokes[i].x, shape.strokes[i].y);

					if (this.ctx.isPointInStroke(linePath, x, y)) {
						this.ctx.restore();
						return true;
					}
				}
				this.ctx.restore();
				return false;
			default:
				break;
		}
	};

	drawDeletedShape(shape: Shape) {
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
		switch (shape.type) {
			case "rect":
				this.ctx.beginPath();
				this.ctx.rect(
					shape.startX,
					shape.startY,
					shape?.width!,
					shape?.height!
				);
				this.ctx.stroke();
				break;
			case "circle":
				this.ctx.beginPath();
				this.ctx.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI);
				this.ctx.stroke();

				break;
			case "line":
				this.ctx.beginPath();
				this.ctx.moveTo(shape.startX, shape.startY);
				this.ctx.lineTo(shape.endX!, shape.endY!);
				this.ctx.stroke();
				break;
			case "pencil":
				if (shape.strokes.length > 1) {
					shape.strokes.map((_, index) => {
						if (index >= 1) {
							this.ctx.beginPath();
							this.ctx.moveTo(
								shape.strokes[index - 1].x,
								shape.strokes[index - 1].y
							);
							this.ctx.lineTo(shape.strokes[index].x, shape.strokes[index].y);
							this.ctx.stroke();
						}
					});
				}
			default:
				break;
		}
		this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
		this.ctx.lineWidth = 2;
	}

	clearCanvas() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.existingShapes.forEach((shape) => {
			if (shape.type === "rect") {
				this.ctx.beginPath();
				this.ctx.rect(
					shape.startX,
					shape.startY,
					shape?.width!,
					shape?.height!
				);
				this.ctx.stroke();
			} else if (shape.type === "circle") {
				this.ctx.beginPath();
				this.ctx.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI);
				this.ctx.stroke();
			} else if (shape.type === "line") {
				this.ctx.beginPath();
				this.ctx.moveTo(shape.startX, shape.startY);
				this.ctx.lineTo(shape.endX!, shape.endY!);
				this.ctx.stroke();
			} else if (shape.type === "pencil") {
				if (shape.strokes.length > 1) {
					shape.strokes.map((_, index) => {
						if (index >= 1) {
							this.ctx.beginPath();
							this.ctx.moveTo(
								shape.strokes[index - 1].x,
								shape.strokes[index - 1].y
							);
							this.ctx.lineTo(shape.strokes[index].x, shape.strokes[index].y);
							this.ctx.stroke();
						}
					});
				}
			}
		});
	}
}
