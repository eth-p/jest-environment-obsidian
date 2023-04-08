const MOCK_METADATA = Symbol('mocked');

export class MockedFunctionMetadata {
	public calledTimes: number = 0;
	public calledArgs: any[] | null = null;
}

type MockedFunction<F extends undefined | ((this: any, ...args: any[]) => any)> = F extends undefined
	? (...args: any[]) => any
	: F;

/**
 * Creates a mock function.
 *
 * @param impl The function implementation.
 * @returns The mock function.
 */
export function createMockFunction<F extends undefined | ((this: any, ...args: any[]) => any)>(
	impl?: F,
): MockedFunction<F> {
	const meta = new MockedFunctionMetadata();
	const fn = function (...args: any[]) {
		meta.calledTimes++;
		meta.calledArgs = args.slice(0);

		if (impl != null) {
			return Reflect.apply(impl, this, args);
		}
	};

	fn[MOCK_METADATA] = meta;
	return fn as any;
}

function getMockMetadata(fn: MockedFunction<any>): MockedFunctionMetadata {
	if (!(MOCK_METADATA in fn)) throw new Error('Function is not mocked.');
	return fn[MOCK_METADATA];
}

export function getTimesCalled(fn: MockedFunction<any>): number {
	return getMockMetadata(fn).calledTimes;
}

export function getArgumentsCalledWith(fn: MockedFunction<any>): any[] | null {
	return getMockMetadata(fn).calledArgs;
}
