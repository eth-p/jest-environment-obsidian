// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface Math {
//         clamp(value: number, min: number, max: number): number;
//         square(value: number): number;
//     }
//

Math.clamp = function clamp(value: number, min: number, max: number): number {
	if (value < min) return min;
	if (value > max) return max;
	return value;
};

Math.square = function square(value: number): number {
	return value * value;
};
