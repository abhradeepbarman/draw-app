export interface Rect {
	id: string;
	type: "rect";
	startX: number;
	startY: number;
	width: number;
	height: number;
}

export interface Circle {
	id: string;
	type: "circle";
	startX: number;
	startY: number;
	radius: number;
}

export interface Line {
	id: string;
	type: "line";
	startX: number;
	startY: number;
	endX: number;
	endY: number;
}

export interface Text {
	id: string;
	type: "text";
	startX: number;
	startY: number;
	text: string;
}

export interface Pencil {
	id: string;
	type: "pencil";
	strokes: {
		x: number;
		y: number;
	}[];
}

export interface Eraser {
	id: string;
	type: "eraser";
}

export type Shape = Rect | Circle | Line | Text | Pencil | Eraser;
