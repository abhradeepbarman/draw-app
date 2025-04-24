type Shape = {
    type: "rect";
    startX: number;
    startY: number;
    width: number;
    height: number;
};

function initDraw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    let clicked = false;
    let startX = 0;
    let startY = 0;

    const existingShapes: Shape[] = [];

    // ctx.strokeRect(10, 10, 200, 100);
    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const width = endX - startX;
        const height = endY - startY;
        existingShapes.push({
            startX,
            startY,
            width,
            height,
            type: "rect",
        });
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;

            const width = endX - startX;
            const height = endY - startY;

            clearCanvas(canvas, ctx, existingShapes);
            ctx.strokeRect(startX, startY, width, height);
        }
    });
}

const clearCanvas = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    existingShapes: Shape[]
) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("canvas cleared");

    existingShapes.forEach((shape) => {
        ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    });
};

export default initDraw;
