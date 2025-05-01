export interface Rect {
    id?: string;
    type: "rect";
    startX: number;
    startY: number;
    width: number;
    height: number;
}

export interface Circle {
    id?: string;
    type: "circle";
    startX: number;
    startY: number;
    radius: number;
}

export interface Line {
    id?: string;
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface PencilStrokes {
    type: "pencilStrokes";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface Pencil {
    id?: string;
    type: "pencil";
    strokes: PencilStrokes[];
}

export type Shape = Rect | Circle | Line | Pencil;
