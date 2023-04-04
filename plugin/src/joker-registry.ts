import { runTestFunction } from './joker-runner';
import { Test, TestFile, TestFunction, TestSuite } from './joker-test';

const TEST_FILES = new Map<string, TestFile>();
const TEST_CONTEXT_STACK: RegistryContext[] = [];

/**
 * Gets all the test files.
 * @returns The list of test files.
 */
export function allFiles(): TestFile[] {
	return Array.from(TEST_FILES.values());
}

/**
 * Gets all the tests.
 * @returns The flattened list of tests.
 */
export function allTests(): Test[] {
	return allFiles().flatMap((file) => {
		const fileTests = Array.from(file.tests.values());
		const suiteTests = Array.from(file.suites.values()).flatMap((suite) => Array.from(suite.tests));
		return [...fileTests, ...suiteTests];
	});
}

interface RegistryContext {
	defineTest(description: string, main: TestFunction): Promise<void>;
	defineSuite(description: string, main: TestFunction): Promise<void>;
}

/**
 * Cleans up the name of a test file.
 * @param name The file name, as encoded by esbuild.
 * @returns The cleaned up file name,.
 */
function cleanTestFileName(name: string): string {
	if (name.startsWith('../src/')) name = name.substring('../src/'.length);
	return name;
}

/**
 * Infers the test file using the current stack.
 * This relies on an implementation detail of esbuild, and might break.
 */
function inferTestFile(): TestFile | null {
	const stack = new Error().stack!;
	const matches = /^\s*at ([^ ]+\.test\.(?:(?:ts|js)x?) )/m.exec(stack);
	if (matches == null) {
		return null;
	}

	const name = cleanTestFileName(matches[1]);
	let file = TEST_FILES.get(name);
	if (file == null) {
		file = new TestFile(name);
		TEST_FILES.set(name, file);
	}

	return file;
}

/**
 * Gets the current registry context.
 */
export function context(): RegistryContext {
	if (TEST_CONTEXT_STACK.length > 0) {
		return TEST_CONTEXT_STACK[TEST_CONTEXT_STACK.length - 1];
	}

	const file = inferTestFile();
	if (file == null) {
		throw new Error('Unable to determine test module name.');
	}

	return new TestFileContext(file);
}

class TestFileContext implements RegistryContext {
	private readonly file: TestFile;
	public constructor(file: TestFile) {
		this.file = file;
	}

	/** @override */
	public async defineTest(description: string, main: TestFunction): Promise<void> {
		const { file } = this;
		file.tests.add(new Test(description, main, { suite: file }));
	}

	/** @override */
	public async defineSuite(description: string, main: TestFunction): Promise<void> {
		const { file } = this;
		let suite = file.suites.get(description);
		if (suite == null) {
			suite = new TestSuite(description, file);
			file.suites.set(description, suite);
		}

		try {
			TEST_CONTEXT_STACK.push(new TestSuiteContext(suite));
			await runTestFunction(main);
		} finally {
			TEST_CONTEXT_STACK.pop();
		}
	}
}

class TestSuiteContext implements RegistryContext {
	private readonly suite: TestSuite;
	public constructor(suite: TestSuite) {
		this.suite = suite;
	}

	/** @override */
	public async defineTest(description: string, main: TestFunction): Promise<void> {
		const { suite } = this;
		suite.tests.add(new Test(description, main, { suite }));
	}

	/** @override */
	public async defineSuite(description: string, main: TestFunction): Promise<void> {
		throw new Error('Cannot call `describe` within `describe`.');
	}
}
