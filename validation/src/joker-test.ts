export type TestFunctionAsyncPromise = () => Promise<void>;
export type TestFunctionAsyncCallback = (done: (error?: Error) => void) => void;
export type TestFunctionSync = () => void;

/**
 * A Jest test function.
 */
export type TestFunction = TestFunctionSync | TestFunctionAsyncPromise | TestFunctionAsyncCallback;

/**
 * An abstraction of a Jest test.
 * This contains test metadata.
 */
export class Test {
	public readonly testSetup: TestFunction | null;
	public readonly testTeardown: TestFunction | null;
	public readonly testMain: TestFunction;

	/**
	 * The test suite.
	 */
	public readonly suite: TestSuite | null;

	/**
	 * A small description of the test.
	 */
	public readonly description: string;

	public constructor(
		description: string,
		main: TestFunction,
		options?: {
			suite?: TestSuite;
			setup?: TestFunction;
			teardown?: TestFunction;
		},
	) {
		this.description = description;
		this.testMain = main;

		this.testSetup = options?.setup ?? null;
		this.testTeardown = options?.teardown ?? null;
		this.suite = options?.suite ?? null;
	}

	/**
	 * Gets a unique path that represents this test.
	 */
	public toPath(): string {
		return this.suite == null ? this.description : `${this.suite.toPath()} -> ${this.description}`;
	}

	/**
	 * Gets the `beforeEach` setup functions, in order from least specific to most specific.
	 * Basically, file -> suite -> test.
	 */
	public getLifecycleSetupFunctions(): TestFunction[] {
		const fns: TestFunction[] = [];

		for (let suite = this.suite; suite != null; suite = suite?.parent) {
			for (const setup of suite.foreachSetup ?? []) {
				fns.push(setup);
			}
		}

		if (this.testSetup != null) {
			fns.push(this.testSetup);
		}

		return fns.reverse();
	}

	/**
	 * Gets the `afterEach` teardown functions, in order from least specific to most specific.
	 * Basically, file -> suite -> test.
	 */
	public getLifecycleTeardownFunctions(): TestFunction[] {
		const fns: TestFunction[] = [];

		for (let suite = this.suite; suite != null; suite = suite?.parent) {
			for (const setup of suite.foreachTeardown ?? []) {
				fns.push(setup);
			}
		}

		if (this.testTeardown != null) {
			fns.push(this.testTeardown);
		}

		return fns.reverse();
	}
}

export class TestSuite {
	public readonly description: string;
	public readonly parent: TestSuite | null;

	public readonly tests: Set<Test> = new Set();

	public readonly forallSetup: TestFunction[] = [];
	public readonly forallTeardown: TestFunction[] = [];

	public readonly foreachSetup: TestFunction[] = [];
	public readonly foreachTeardown: TestFunction[] = [];

	public constructor(description: string, parent?: TestSuite) {
		this.description = description;
		this.parent = parent ?? null;
	}

	/**
	 * Gets a unique path that represents this test suite.
	 */
	public toPath(): string {
		const components: string[] = [this.description];
		for (let parent = this.parent; parent != null; parent = parent.parent) {
			components.push(parent.description);
		}

		return components.reverse().join(' -> ');
	}
}

export class TestFile extends TestSuite {
	public readonly suites: Map<string, TestSuite> = new Map();
}

/**
 * The results of a test.
 */
export class TestResult {
	public readonly passed: boolean;
	public readonly error: Error | undefined;
	public readonly duration: number;

	public constructor(passed: boolean, duration: number, error: Error | undefined) {
		this.passed = passed;
		this.duration = duration;
		this.error = error;
	}
}
