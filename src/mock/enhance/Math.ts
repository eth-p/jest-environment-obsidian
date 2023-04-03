// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface Math {
//         clamp(value: number, min: number, max: number): number;
//         square(value: number): number;
//     }
//
export default function patch(ctor: Math): void {
	Object.assign(ctor as any, {
		//

		clamp(value: number, min: number, max: number): number {
			if (value < min) return min;
			if (value > max) return max;
			return value;
		},

		square(value: number): number {
			return value * value;
		},

		//
	});
}

