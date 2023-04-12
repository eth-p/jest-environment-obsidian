import { PACKAGE_NAME } from '../constants';

/**
 * Applys a monkey-patch to a function on an object.
 *
 * @param target The target object.
 * @param prop The name of the function to patch.
 * @param replacement The replacement function.
 */
export default function monkeypatch<
	T,
	K extends keyof T,
	F extends { [Key in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never }[K],
>(target: T, prop: K, replacement: (original: F, ...args: [...Parameters<F>, ...unknown[]]) => ReturnType<F>): void {
	const original = target[prop] as (...args: unknown[]) => unknown;
	const name = `${prop.toString()} [${PACKAGE_NAME}]`;
	const hooked = {
		[name](this: unknown, ...args: unknown[]) {
			return Reflect.apply(replacement, this, [original.bind(this), ...args]);
		},
	}[name];

	(target[prop] as unknown) = hooked;
}
