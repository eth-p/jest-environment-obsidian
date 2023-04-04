import { Expect } from './joker-expect';
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
