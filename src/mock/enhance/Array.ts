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

export default function createExtension(globalThis: typeof global) {
	return class<T> extends Array<T> {
		static combine<T>(arrays: T[][]): T[] {
			return arrays.flat(1);
		}

		first(): T | undefined {
			if (this.length === 0) return undefined;
			return this[0];
		}

		last(): T | undefined {
			if (this.length === 0) return undefined;
			return this[this.length - 1];
		}

		remove(target: T): void {
			for (let i = 0; i < this.length; i++) {
				if (this[i] === target) {
					this.splice(i, 1);
					i--;
				}
			}
		}

		contains(item: T): boolean {
			return this.includes(item);
		}

		shuffle(): this {
			__UNIMPLEMENTED__();
		}

		unique(): T[] {
			__UNIMPLEMENTED__();
		}
	};
}
