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
import { __UNIMPLEMENTED__ } from '../../util';

export default function patch(ctor: ArrayConstructor) {
	const proto = ctor.prototype as ArrayConstructor['prototype'];

	Object.assign(ctor, {
		combine<T>(arrays: T[][]): T[] {
			return arrays.flat(1);
		},
	});

	Object.assign(proto, {
		//

		first<T>(this: Array<T>): T | undefined {
			if (this.length === 0) return undefined;
			return this[0];
		},

		last<T>(this: Array<T>): T | undefined {
			if (this.length === 0) return undefined;
			return this[this.length - 1];
		},

		remove<T>(this: Array<T>, target: T): void {
			for (let i = 0; i < this.length; i++) {
				if (this[i] === target) {
					this.splice(i, 1);
					i--;
				}
			}
		},

		contains<T>(this: Array<T>, item: T): boolean {
			return this.includes(item);
		},

		shuffle<T>(this: Array<T>): Array<T> {
			__UNIMPLEMENTED__();
		},

		unique<T>(this: Array<T>): T[] {
			__UNIMPLEMENTED__();
		},

		//
	});
}
