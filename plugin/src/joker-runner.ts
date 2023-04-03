import { ExpectationUnimplemenetedError } from './joker-expect';
import {
	type Test,
	type TestFunction,
	type TestFunctionAsyncPromise,
	type TestFunctionSync,
	TestResult,
} from './joker-test';

// TODO: Setup and teardown.

/**
 * A class which runs tests.
 */
export class TestRunner {
	private readonly maxSliceDuration: number;

	/**
	 * Runs a single test and returns its results.
	 *
	 * @param test The test to run.
	 * @returns The test runs.
	 */
	public async runTest(test: Test): Promise<TestResult> {
		const results = await runTestFunction(test.testMain);

		if (results.error instanceof TypeError) {
			const matchesUnimplemented = /^expect\(\.\.\.\)\.([^ ]+) is not a function/.exec(results.error.message);
			if (matchesUnimplemented != null) {
				results.error = new ExpectationUnimplemenetedError(matchesUnimplemented[1]);
			}
		}

		return new TestResult(results.error == null, results.end - results.start, results.error);
	}

	/**
	 * Runs multiple tests in a way that should be friendly to the event loop.
	 *
	 * Within an alloted time slice, as many tests as possible are run.
	 * If the time slice is exceeded, control is handed back to the browser using setTimeout.
	 *
	 * @param tests The tests to run.
	 * @param progress A progress function for completed tests within a single time slice.
	 *
	 * @returns The test results.
	 */
	public async runTests(
		tests: Test[],
		progress?: (tests: Array<[Test, TestResult]>) => void,
	): Promise<Map<Test, TestResult>> {
		const results = new Map<Test, TestResult>();
		const updates = [] as Array<[Test, TestResult]>;

		const { maxSliceDuration } = this;
		let sliceDuration = 0;
		for (const test of tests) {
			const testResult = await this.runTest(test);
			results.set(test, testResult);
			updates.push([test, testResult]);

			// Wait for a little while.
			sliceDuration += testResult.duration;
			if (sliceDuration > maxSliceDuration) {
				sliceDuration = 0;
				progress?.(updates.splice(0, updates.length));
				await defer();
			}
		}

		return results;
	}
}

/**
 * Halts operation for a little while, letting the browser do what it needs to do.
 * @returns A promise to await.
 */
function defer(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, 0);
	});
}

/**
 * Runs a {@link TestFunction}, recording the time when it starts and finishes.
 *
 * @param fn The test function.
 * @returns Results and timing information.
 */
export async function runTestFunction(
	fn: TestFunction,
): Promise<{ error: undefined | Error; start: DOMHighResTimeStamp; end: DOMHighResTimeStamp }> {
	let result: Awaited<ReturnType<typeof runTestFunction>> = {
		error: undefined,
		start: undefined as unknown as DOMHighResTimeStamp,
		end: undefined as unknown as DOMHighResTimeStamp,
	}!;

	// If there are arguments, it's an async callback function.
	if (fn.length > 0) {
		return new Promise((resolve) => {
			const doneCallback = (error?: Error) => {
				result.end = performance.now();
				result.error = error;
				resolve(result);
			};

			try {
				result.start = performance.now();
				fn(doneCallback);
				result.end = performance.now();
			} catch (error) {
				result.end = performance.now();
				result.error = error;
				resolve(result);
			}
		});
	}

	// If there are no arguments, it's either an async promise function, or a sync function.
	try {
		result.start = performance.now();
		const promise = (fn as TestFunctionAsyncPromise | TestFunctionSync)();
		result.end = performance.now();

		// If it returned a promise, wait for the promise.
		if (promise != null && 'then' in promise) {
			await promise;
			result.end = performance.now();
		}
	} catch (error) {
		result.end = performance.now();
		result.error = error;
	}

	return result;
}
