import { Tool } from "@/@types/tools";
import { deleteShapes, getPreviousChats, sendShape, updateShape } from "@/apis";
import {
	distanceBetweenTwoPoints,
	isPointInRectangle,
	isPointOnLine,
} from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
type Point = { x: number; y: number };
export class Draw {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private existingShapes: Tool[];
	private projectId: string;
	private socket: WebSocket;
	private clicked: Boolean = false;
	private startX: number = 0;
	private startY: number = 0;
	private lastX: number = 0;
	private lastY: number = 0;
	private pencilStrokes: {
		x: number;
		y: number;
	}[] = [];
	private deletedShapes: Tool[] = [];
	private selectedTool: Tool["type"] = "rect";
	private setSelectedTool: React.Dispatch<React.SetStateAction<Tool["type"]>>;
	private selectedShape: Tool | null = null;
	private fontSize: number = 30;
	private fontStyle: string = "arial";
	private fontColor: string = "white";
	private tolerance: number = 20;

	constructor(
		canvas: HTMLCanvasElement,
		projectId: string,
		socket: WebSocket,
		setSelectedTool: React.Dispatch<React.SetStateAction<Tool["type"]>>
	) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.existingShapes = [];
		this.projectId = projectId;
		this.socket = socket;
		this.init();
		this.initWebsocketHandlers();
		this.initEventHandlers();
		this.setSelectedTool = setSelectedTool;
	}

	destroy() {
		this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
		this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
		this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
		window.removeEventListener("keydown", this.keydownHandler);
	}

	setTool(tool: Tool["type"]) {
		this.selectedTool = tool;
		this.setSelectedTool(tool);

		if (
			tool === "circle" ||
			tool === "rect" ||
			tool === "line" ||
			tool === "pencil"
		) {
			this.changeCursor("crosshair");
		} else if (tool === "eraser") {
			this.changeCursor("url('/eraser-cursor.svg'), auto");
		} else if (tool == "move") {
			this.changeCursor("move");
		}
	}

	async init() {
		this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
		this.ctx.fillStyle = `${this.fontColor}`;
		this.ctx.lineWidth = 2;
		this.ctx.font = `${this.fontSize}px ${this.fontStyle}`;

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
			} else if (incomingMessage.type === "move") {
				this.existingShapes = this.existingShapes.map((shape) =>
					shape.id === incomingMessage.message.id
						? { ...shape, ...incomingMessage.message }
						: shape
				);
				this.clearCanvas();
			}
		};
	}

	initEventHandlers() {
		this.canvas.addEventListener("mousedown", this.mouseDownHandler);
		this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
		this.canvas.addEventListener("mouseup", this.mouseUpHandler);
		window.addEventListener("keydown", this.keydownHandler);
	}

	mouseDownHandler = async (e: MouseEvent) => {
		this.clicked = true;

		var rect = this.canvas.getBoundingClientRect();
		this.startX = e.clientX - rect.left;
		this.startY = e.clientY - rect.top;
		this.lastX = this.startX;
		this.lastY = this.startY;

		this.deletedShapes = [];
		this.pencilStrokes = [];
		this.selectedShape = null;

		if (this.selectedTool === "pencil") {
			this.pencilStrokes.push({
				x: this.startX,
				y: this.startY,
			});
		} else if (this.selectedTool === "move") {
			// if an element in that position
			// select the shape
			this.existingShapes.forEach((shape) => {
				if (this.isOnSurfaceArea(this.startX, this.startY, shape)) {
					this.clearCanvas();
					this.selectedShape = shape;
					this.makeSelectedBorder(shape);
				}
			});
		}
	};

	mouseMoveHandler = (e: MouseEvent) => {
		var rect = this.canvas.getBoundingClientRect();
		const endX = e.clientX - rect.left;
		const endY = e.clientY - rect.top;

		if (this.clicked) {
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
					if (this.isOnSurfaceArea(endX, endY, shape)) {
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

				this.pencilStrokes.map((_, index) => {
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
			} else if (this.selectedTool === "move") {
				// if elements select -> change coordinates
				if (this.selectedShape) {
					const dx = endX - this.lastX;
					const dy = endY - this.lastY;

					this.existingShapes = this.existingShapes.filter(
						(s) => s.id != this.selectedShape?.id
					);

					if (
						this.selectedShape.type === "rect" ||
						this.selectedShape.type === "circle" ||
						this.selectedShape.type === "text"
					) {
						this.selectedShape = {
							...this.selectedShape,
							startX: this.selectedShape.startX + dx,
							startY: this.selectedShape.startY + dy,
						};
					} else if (this.selectedShape.type === "line") {
						this.selectedShape = {
							...this.selectedShape,
							startX: this.selectedShape.startX + dx,
							startY: this.selectedShape.startY + dy,
							endX: this.selectedShape.endX + dx,
							endY: this.selectedShape.endY + dy,
						};
					} else if (this.selectedShape.type === "pencil") {
						this.selectedShape = {
							...this.selectedShape,
							strokes:
								this.selectedShape.strokes?.map((stroke) => ({
									x: stroke.x + dx,
									y: stroke.y + dy,
								})) || [],
						};
					}

					this.existingShapes = [
						...this.existingShapes,
						{ ...this.selectedShape },
					];

					this.clearCanvas();
					this.makeSelectedBorder(this.selectedShape);
				}
			}
		} else if (this.selectedTool == "move") {
			let hovering = false;
			for (const shape of this.existingShapes) {
				if (this.isOnSurfaceArea(endX, endY, shape)) {
					hovering = true;
					break;
				}
			}
			this.changeCursor(hovering ? "move" : "default");
		}
		this.lastX = endX;
		this.lastY = endY;
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

			const message: Tool = {
				id,
				type: "rect",
				startX: this.startX,
				startY: this.startY,
				width,
				height,
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
		} else if (this.selectedTool === "circle") {
			const radius =
				Math.sqrt(
					Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
				) / 2;

			const centerX = this.startX + radius;
			const centerY = this.startY + radius;

			const message: Tool = {
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
			const message: Tool = {
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
			this.deletedShapes.forEach((shape: Tool) => {
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
			const message: Tool = {
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
		} else if (this.selectedTool === "move" && this.selectedShape) {
			const message = this.selectedShape;
			const messageString = JSON.stringify(message);

			await updateShape(this.projectId, messageString);

			this.socket.send(
				JSON.stringify({
					type: "move",
					roomId: this.projectId,
					message,
				})
			);
			this.selectedShape = null;
			this.clearCanvas();
		}
	};

	keydownHandler = async (e: KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
			e.preventDefault();

			// check if selected shape --> paste the same shape in little bit distance
			// else -- check clipboard -- paste the shape in the existing shape -- clear canvas
			const id = uuidv4();
			if (this.selectedShape) {
				const dist = 20;
				const newShape = {
					...this.selectedShape,
					id,
				};

				if (
					newShape.type === "rect" ||
					newShape.type === "circle" ||
					newShape.type === "text"
				) {
					newShape.startX += dist;
					newShape.startY += dist;
				} else if (newShape.type === "line") {
					newShape.startX += dist;
					newShape.startY += dist;
					newShape.endX += dist;
					newShape.endY += dist;
				} else if (newShape.type === "pencil") {
					newShape.strokes =
						newShape.strokes?.map((stroke) => ({
							...stroke,
							x: stroke.x + dist,
							y: stroke.y + dist,
						})) || [];
				}

				this.existingShapes = [...this.existingShapes, newShape];
				this.clearCanvas();

				const messageString = JSON.stringify(newShape);
				await sendShape(this.projectId, messageString);
				this.socket?.send(
					JSON.stringify({
						type: "chat",
						roomId: this.projectId,
						message: newShape,
					})
				);
				this.selectedShape = null;
			} else {
				try {
					const text = await navigator.clipboard.readText();
					if (!text) return;

					// get current cursor location
					// convert text to shape type -> insert in existing shape
					// make the shape there
					const message: Tool = {
						id,
						type: "text",
						startX: this.lastX,
						startY: this.lastY,
						text,
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
				} catch (error) {
					console.error("Failed to read clipboard:", error);
				}
			}
		} else if (e.key.toLowerCase() === "backspace") {
			if (this.selectedShape) {
				this.existingShapes = this.existingShapes.filter(
					(shape) => shape.id !== this.selectedShape?.id
				);
				this.clearCanvas();

				const deletedChats = [this.selectedShape?.id];
				await deleteShapes(this.projectId, deletedChats);
				this.socket.send(
					JSON.stringify({
						type: "delete_chat",
						roomId: this.projectId,
						message: deletedChats,
					})
				);
			}
		}
	};

	isOnSurfaceArea = (x: number, y: number, shape: Tool) => {
		switch (shape.type) {
			case "rect":
				const endX = shape.startX + shape.width;
				const endY = shape.startY + shape.height;

				// Check if point is within rectangle bounds
				const withinX =
					x >= shape.startX - this.tolerance && x <= endX + this.tolerance;
				const withinY =
					y >= shape.startY - this.tolerance && y <= endY + this.tolerance;

				// Touching left or right border with this.tolerance
				const onVerticalEdge =
					(Math.abs(x - shape.startX) <= this.tolerance ||
						Math.abs(x - endX) <= this.tolerance) &&
					withinY;

				// Touching top or bottom border with this.tolerance
				const onHorizontalEdge =
					(Math.abs(y - shape.startY) <= this.tolerance ||
						Math.abs(y - endY) <= this.tolerance) &&
					withinX;

				return onVerticalEdge || onHorizontalEdge;
			case "circle":
				var d = distanceBetweenTwoPoints(x, y, shape.startX, shape.startY);
				return Math.abs(d - shape.radius) <= this.tolerance;
			case "line":
				return isPointOnLine(
					x,
					y,
					shape.startX,
					shape.startY,
					shape.endX,
					shape.endY,
					this.tolerance
				);
			case "pencil":
				for (let i = 1; i < shape.strokes.length; i++) {
					const p1 = shape.strokes[i - 1];
					const p2 = shape.strokes[i];
					if (isPointOnLine(x, y, p1.x, p1.y, p2.x, p2.y, this.tolerance)) {
						return true;
					}
				}
				return false;
			case "text":
				// exception: for text, return true if cursor is over text
				const width = this.ctx.measureText(shape.text).width;
				const height = this.fontSize;
				return isPointInRectangle(
					x,
					y,
					shape.startX,
					shape.startY,
					width,
					height,
					this.tolerance
				);
			default:
				break;
		}
	};

	drawDeletedShape(shape: Tool) {
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
		this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
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
				break;
			case "text":
				this.ctx.fillText(shape.text, shape.startX, shape.startY);
				this.ctx.stroke();
				break;
			default:
				break;
		}
		this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
		this.ctx.fillStyle = this.fontColor;
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
			} else if (shape.type === "text") {
				this.ctx.fillText(shape.text, shape.startX, shape.startY);
			}
		});
	}

	changeCursor(type = "default") {
		if (!this.canvas) return;
		this.canvas.style.cursor = type;
	}

	makeSelectedBorder(shape: Tool) {
		const { topLeft, topRight, bottomLeft, bottomRight } =
			this.getBoundingBox(shape)!;

		// dashed rectangle - faded
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
		this.ctx.setLineDash([5, 5]);
		this.ctx.beginPath();
		this.ctx.moveTo(topLeft.x, topLeft.y);
		this.ctx.lineTo(topRight.x, topRight.y);
		this.ctx.lineTo(bottomRight.x, bottomRight.y);
		this.ctx.lineTo(bottomLeft.x, bottomLeft.y);
		this.ctx.lineTo(topLeft.x, topLeft.y);
		this.ctx.stroke();
		this.ctx.setLineDash([]);
		this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	}

	getBoundingBox(shape: Tool):
		| {
				topLeft: Point;
				topRight: Point;
				bottomLeft: Point;
				bottomRight: Point;
		  }
		| undefined {
		switch (shape.type) {
			// a --- b
			// |	 |
			// d --- c
			case "rect":
				return {
					topLeft: {
						x: shape.startX - this.tolerance,
						y: shape.startY - this.tolerance,
					},
					topRight: {
						x: shape.startX + shape.width + this.tolerance,
						y: shape.startY - this.tolerance,
					},
					bottomLeft: {
						x: shape.startX - this.tolerance,
						y: shape.startY + shape.height + this.tolerance,
					},
					bottomRight: {
						x: shape.startX + shape.width + this.tolerance,
						y: shape.startY + shape.height + this.tolerance,
					},
				};
			case "circle":
				return {
					topLeft: {
						x: shape.startX - shape.radius - this.tolerance,
						y: shape.startY + shape.radius + this.tolerance,
					},
					topRight: {
						x: shape.startX + shape.radius + this.tolerance,
						y: shape.startY + shape.radius + this.tolerance,
					},
					bottomLeft: {
						x: shape.startX - shape.radius - this.tolerance,
						y: shape.startY - shape.radius - this.tolerance,
					},
					bottomRight: {
						x: shape.startX + shape.radius + this.tolerance,
						y: shape.startY - shape.radius - this.tolerance,
					},
				};
			case "line":
				var left = Math.min(shape.startX, shape.endX!);
				var right = Math.max(shape.startX, shape.endX!);
				var bottom = Math.max(shape.startY, shape.endY!);
				var top = Math.min(shape.startY, shape.endY!);
				return {
					topLeft: {
						x: left - this.tolerance,
						y: top - this.tolerance,
					},
					topRight: {
						x: right + this.tolerance,
						y: top - this.tolerance,
					},
					bottomLeft: {
						x: left - this.tolerance,
						y: bottom + this.tolerance,
					},
					bottomRight: {
						x: right + this.tolerance,
						y: bottom + this.tolerance,
					},
				};
			case "text":
				const width = this.ctx.measureText(shape.text).width;
				const height = this.fontSize;

				return {
					topLeft: {
						x: shape.startX - this.tolerance,
						y: shape.startY - height - this.tolerance,
					},
					topRight: {
						x: shape.startX + width + this.tolerance,
						y: shape.startY - height - this.tolerance,
					},
					bottomLeft: {
						x: shape.startX - this.tolerance,
						y: shape.startY + this.tolerance,
					},
					bottomRight: {
						x: shape.startX + width + this.tolerance,
						y: shape.startY + this.tolerance,
					},
				};

			case "pencil":
				// find left most point, right most point, top most point, bottom most point
				var left = Math.min(...shape.strokes.map((stroke) => stroke.x));
				var right = Math.max(...shape.strokes.map((stroke) => stroke.x));
				var top = Math.min(...shape.strokes.map((stroke) => stroke.y));
				var bottom = Math.max(...shape.strokes.map((stroke) => stroke.y));

				return {
					topLeft: {
						x: left - this.tolerance,
						y: top - this.tolerance,
					},
					topRight: {
						x: right + this.tolerance,
						y: top - this.tolerance,
					},
					bottomLeft: {
						x: left - this.tolerance,
						y: bottom + this.tolerance,
					},
					bottomRight: {
						x: right + this.tolerance,
						y: bottom + this.tolerance,
					},
				};
			default:
				break;
		}
	}
}
