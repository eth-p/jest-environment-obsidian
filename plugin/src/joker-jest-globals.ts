import { Expect } from './joker-expect';
import { context } from './joker-registry';
import { type TestFunction } from './joker-test';

export function expect<T>(value: T) {
	return new Expect(value);
}

export async function describe(name: string, fn: TestFunction): Promise<void> {
	context().defineSuite(name, fn);
}

export async function test(name: string, fn: TestFunction): Promise<void> {
	context().defineTest(name, fn);
}
