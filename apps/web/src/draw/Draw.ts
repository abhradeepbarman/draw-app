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
	private deletedShapes: Shape[] = [];
	private selectedTool: Shape["type"] = "rect";
	private fontSize: number = 30;

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
		this.ctx.font = `${this.fontSize}px arial`;
		this.ctx.textBaseline = "top";

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

		if (this.selectedTool === "text") {
			const inputX = this.startX;
			const inputY = this.startY;

			const inputBox = document.createElement("textarea");
			inputBox.style.position = "absolute";
			inputBox.style.font = `${this.fontSize}px arial`;
			inputBox.style.color = "white";
			inputBox.style.left = inputX + "px";
			inputBox.style.top = inputY + "px";
			inputBox.style.border = "none";
			inputBox.style.outline = "none";

			// height & width of textarea box will be from current position to the end of the screen
			inputBox.style.width = "250px";
			inputBox.style.height = "300px";

			document.body.appendChild(inputBox);
			setTimeout(() => {
				inputBox.focus();
			}, 0);

			inputBox.onblur = () => {
				const message: Shape = {
					id: uuidv4(),
					type: "text",
					startX: inputX,
					startY: inputY,
					text: inputBox.value,
				};
				if (inputBox.value.trim() !== "") {
					this.existingShapes.push(message);
					const messageString = JSON.stringify(message);
					sendShape(this.projectId, messageString);
					this.clearCanvas();
				}
				document.body.removeChild(inputBox);
			};
		}

		this.deletedShapes = [];
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
				linePath.lineTo(shape.endX!, shape.endY!);
				return this.ctx.isPointInPath(linePath, x, y);
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
			default:
				break;
		}
		this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
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
			}
		});
	}
}
