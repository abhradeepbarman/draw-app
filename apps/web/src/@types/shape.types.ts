export interface Shape {
    type: "rect" | "circle" | "line" | "text";
    startX: number;
    startY: number;
    width?: number;
    height?: number;
    radius?: number;
    endX?: number;
    endY?: number;
}