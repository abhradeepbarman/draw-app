export interface Rect {
    type: "rect";
    startX: number;
    startY: number;
    width: number;
    height: number;
}

export interface Circle {
    type: "circle";
    startX: number;
    startY: number;
    radius: number;
}

export interface Line {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export type Shape = Rect | Circle | Line;