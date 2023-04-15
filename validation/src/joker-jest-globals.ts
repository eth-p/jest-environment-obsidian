import { Expect } from './joker-expect';
import { createMockFunction } from './joker-mock-function';
import { context } from './joker-registry';
import { type TestFunction } from './joker-test';

export function expect<T>(value: T) {
	return new Expect(value);
}

export function describe(name: string, fn: TestFunction): void {
	context().defineSuite(name, fn);
}

export function test(name: string, fn: TestFunction): void {
	context().defineTest(name, fn);
}

export function beforeEach(setupFn: TestFunction): void {
	context().addLifecycleBeforeEach(setupFn);
}

export function afterEach(setupFn: TestFunction): void {
	context().addLifecycleAfterEach(setupFn);
}

export namespace jest {
	export function fn(fn?: (this: any, ...args: any[]) => any) {
		return createMockFunction(fn);
	}
}
