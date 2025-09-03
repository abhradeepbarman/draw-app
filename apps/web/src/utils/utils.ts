export function distanceBetweenTwoPoints(
	x1: number,
	y1: number,
	x2: number,
	y2: number
) {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function isPointOnLine(
	x: number,
	y: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	tolerance = 0.0
) {
	const d1 = distanceBetweenTwoPoints(x, y, x1, y1);
	const d2 = distanceBetweenTwoPoints(x, y, x2, y2);
	const lineDist = distanceBetweenTwoPoints(x1, y1, x2, y2);

	return Math.abs(d1 + d2 - lineDist) <= tolerance;
}

export function isPointInRectangle(
	px: number,
	py: number,
	startX: number,
	startY: number,
	width: number,
	height: number,
	tolerance: number = 0
) {
	if (
		px >= startX - tolerance &&
		px <= startX + width + tolerance &&
		py >= startY - tolerance &&
		py <= startY + height + tolerance
	) {
		return true;
	}
	return false;
}
