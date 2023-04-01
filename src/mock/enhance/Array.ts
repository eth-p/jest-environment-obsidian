// From Obsidian Type Definitions:
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
export default function patch(ctor: ArrayConstructor): void {
	const proto = ctor.prototype as any;
	Object.assign(ctor.prototype as any, {
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

		contains: Array.prototype.includes,

		// TODO: shuffle(): this
		// TODO: unique(): T[]

		//
	});
}
