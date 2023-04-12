// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface Array<T> {
//         first(): T | undefined;
//         last(): T | undefined;
//         contains(target: T): boolean;
//         remove(target: T): void;
//         shuffle(): this;
//         unique(): T[];
//     }
//
//     interface ArrayConstructor {
//         combine<T>(arrays: T[][]): T[];
//     }
//
import { __UNIMPLEMENTED__ } from '#runtime';

Array.prototype.first = function first<T>(this: Array<T>): T | undefined {
	if (this.length === 0) return undefined;
	return this[0];
};

Array.prototype.last = function last<T>(this: Array<T>): T | undefined {
	if (this.length === 0) return undefined;
	return this[this.length - 1];
};

Array.prototype.remove = function remove<T>(this: Array<T>, target: T): void {
	for (let i = 0; i < this.length; i++) {
		if (this[i] === target) {
			this.splice(i, 1);
			i--;
		}
	}
};

Array.prototype.contains = function contains<T>(this: Array<T>, item: T): boolean {
	return this.includes(item);
};

Array.prototype.shuffle = function shuffle<T>(this: Array<T>): Array<T> {
	__UNIMPLEMENTED__();
};

Array.prototype.unique = function unique<T>(this: Array<T>): T[] {
	__UNIMPLEMENTED__();
};

Array.combine = function combine<T>(arrays: T[][]): T[] {
	return arrays.flat(1);
};
