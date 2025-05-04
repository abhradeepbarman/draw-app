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

export interface Text {
    id?: string;
    type: "text";
    text: string;
    startX: number;
    startY: number;
}

export interface Eraser {
    id?: string;
    type: "eraser";
}

export interface Drag {
    id?: string;
    type: "drag";
}

export type Shape = Rect | Circle | Line | Pencil | Eraser | Drag | Text;
