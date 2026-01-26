export const colors = {
	black: "#010101",
	darkGrey: "#505051",
	lightGrey: "#AEADAD",
	beige: "#FFF5F3",
	orange: "#F58C6C",
	turquoise: "#01A0AF",
	purple: "#8579DC",
	darkPurple: "#4A38CC",
	green: "#56C07C",
	red: "#BA0303",
	pink: "#E2026A",
	white: "#FFFFFF",
};

export const colorRoles = {
	dark: colors.black,
	light: colors.beige,
	background: colors.beige,
	primary: colors.black,
	accent: colors.purple,
};

export const badgeColors = {
	light: {
		info: { background: "#E0F2FE", text: "#0C4A6E" },
		minor: { background: "#D1FAE5", text: "#065F46" },
		moderate: { background: "#FEF3C7", text: "#78350F" },
		important: { background: "#FFEDD5", text: "#7C2D12" },
		critical: { background: "#FEE2E2", text: "#991B1B" },
	},
	dark: {
		info: { background: "#1E40AF", text: "#FFFFFF" },
		minor: { background: "#166534", text: "#FFFFFF" },
		moderate: { background: "#A16207", text: "#FFFFFF" },
		important: { background: "#C2410C", text: "#FFFFFF" },
		critical: { background: "#B91C1C", text: "#FFFFFF" },
	},
	neutral: {
		default: { background: "#F3F4F6", text: "#374151" },
		inactive: { background: "#E5E7EB", text: "#4B5563" },
	},
};