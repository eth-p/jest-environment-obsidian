const IS_MOCKED = Symbol('mocked');

type Impl = undefined | ((this: any, ...args: any[]) => any);
type ImplParameters<F extends Impl> = F extends (...args: infer A) => any ? A : any[];
type ImplReturn<F extends Impl> = F extends (...args: any[]) => infer R ? R : any;
type ImplContext<F extends Impl> = F extends (this: infer T, ...args: any[]) => any ? T : any;

interface MockedFunction<F extends Impl> {
	(this: ImplContext<F>, ...args: ImplParameters<F>): ImplReturn<F>;
	[IS_MOCKED]: true;

	mock: MockedFunctionMetadata<F>;
	mockClear(): void;
}

interface MockedFunctionMetadata<F extends Impl> {
	calls: Array<ImplParameters<F>>;
	contexts: Array<ImplContext<F>>;
	lastCall: ImplParameters<F> | undefined;
	results: Array<{
		type: 'return' | 'throw';
		value: ImplReturn<F> | any;
	}>;
}

/**
 * Creates a mock function.
 *
 * @param impl The function implementation.
 * @returns The mock function.
 */
export function createMockFunction<F extends undefined | ((this: any, ...args: any[]) => any)>(
	impl?: F,
): MockedFunction<F> {
	const fn = function (this: ImplReturn<F>, ...args: ImplParameters<F>) {
		const { mock } = fn;
		mock.contexts.push(this);
		mock.calls.push(args);
		mock.lastCall = args;

		if (impl != null) {
			try {
				const returned = Reflect.apply(impl, this, args);
				mock.results.push({ type: 'return', value: returned });
			} catch (ex) {
				mock.results.push({ type: 'throw', value: ex });
				throw ex;
			}
		}

		mock.results.push({ type: 'return', value: undefined });
	} as MockedFunction<F>;

	fn.mockClear = () => {
		fn.mock = {
			calls: [],
			contexts: [],
			results: [],
			lastCall: undefined,
		};
	};

	// Initialize and return.
	fn[IS_MOCKED] = true;
	fn.mockClear();
	return fn as MockedFunction<F>;
}

export function assertMock<F extends (this: any, ...args: any[]) => any>(fn: F): MockedFunction<F> {
	if (!(IS_MOCKED in fn)) throw new Error('Function is not mocked.');
	return fn as unknown as MockedFunction<F>;
}
