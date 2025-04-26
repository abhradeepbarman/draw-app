import { Shape } from "@/@types/shape.types";

let existingShapes: Shape[] = [];

function initDraw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    selectedShape: Shape["type"]
) {
    ctx.strokeStyle = "white";

    let startX = 0;
    let startY = 0;
    let clicked = false;

    const mouseDownHandler = (e: MouseEvent) => {
        clicked = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        if (clicked) {
            const rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;
            clearCanvas(canvas, ctx, existingShapes);

            if (selectedShape === "rect") {
                const width = endX - startX;
                const height = endY - startY;
                ctx.strokeRect(startX, startY, width, height);
            } else if (selectedShape === "circle") {
                const radius = Math.sqrt(
                    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
                );
                ctx.beginPath();
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (selectedShape === "line") {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
    };

    const mouseUpHandler = (e: MouseEvent) => {
        if (!clicked) return;

        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        if (selectedShape === "rect") {
            const width = endX - startX;
            const height = endY - startY;

            existingShapes.push({
                type: "rect",
                startX,
                startY,
                width,
                height,
            });
        } else if (selectedShape === "circle") {
            const radius = Math.sqrt(
                Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
            );

            existingShapes.push({
                type: "circle",
                startX,
                startY,
                radius,
            });
        } else if (selectedShape === "line") {
            existingShapes.push({
                type: "line",
                startX,
                startY,
                endX,
                endY,
            });
        }
        clicked = false;
    };

    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);

    return () => {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
    };
}

function clearCanvas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    existingShapes: Shape[]
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape) => {
        if (shape.type === "rect" && shape.width && shape.height) {
            ctx.beginPath();
            ctx.strokeRect(
                shape.startX,
                shape.startY,
                shape?.width,
                shape?.height
            );
        } else if (shape.type === "circle" && shape.radius) {
            ctx.beginPath();
            ctx.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (shape.type === "line" && shape.endX && shape.endY) {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
        }
    });
}

export default initDraw;
