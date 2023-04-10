// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface Math {
//         clamp(value: number, min: number, max: number): number;
//         square(value: number): number;
//     }
//
import type { Globals } from '#context';
import EnvironmentOptions from '#options';

export default function createExtension(context: Globals, options: EnvironmentOptions) {
	return class {
		static clamp(value: number, min: number, max: number): number {
			if (value < min) return min;
			if (value > max) return max;
			return value;
		}

		static square(value: number): number {
			return value * value;
		}
	};
}
