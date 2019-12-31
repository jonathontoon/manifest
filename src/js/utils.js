export const snapToGrid = (value, grid) => {
	return (grid) * Math.round(value / (grid));
};
