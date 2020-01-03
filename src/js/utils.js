export function snapToGrid (value, grid) {
	return (grid) * Math.round(value / (grid));
};
