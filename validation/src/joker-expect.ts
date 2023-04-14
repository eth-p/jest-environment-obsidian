import { getArgumentsCalledWith, getTimesCalled } from './joker-mock-function';
import { serialize } from './joker-serialize';

/**
 * Error thrown when an expectation fails.
 */
export class ExpectationFailedError extends Error {
	public readonly valueExpected: string;
	public readonly valueReceived: string;
	public readonly expectation: string;

	public constructor(actually: string, operator: string, expected: string) {
		super(`Expected \`${actually}\` ${operator} \`${expected}\``);
		this.valueExpected = expected;
		this.valueReceived = actually;
		this.expectation = operator;
	}
}

/**
 * Error thrown when an expectation isn't implemented.
 */
export class ExpectationUnimplemenetedError extends Error {
	public readonly method: string;

	public constructor(method: string) {
		super(`Unimplemented expect() for method \`${method}\``);
		this.method = method;
	}

	public toHTML(): HTMLElement {
		const div = document.createElement('div');
		div.classList.add('jest-environment-obsidian-error-internal');

		const method = document.createElement('code');
		method.textContent = this.method;

		const title = document.createElement('div');
		title.classList.add('jest-environment-obsidian-error-internal-title');
		title.textContent = `Unimplemented Expect Function: `;
		title.appendChild(method);

		const description = document.createElement('div');
		description.classList.add('jest-environment-obsidian-error-internal-description');
		description.textContent = `To run Jest tests within Obsidian, we use a shimmed test runner named "joker". An expect() function used in this test is not yet implemented in joker.`;

		div.appendChild(title);
		div.appendChild(description);
		return div;
	}
}

export class Expect<T> {
	#value: T;
	#negated: boolean;
	#fail: (actually: any, op: string, expected: any) => never;

	public constructor(value: T) {
		this.#value = value;
		this.#negated = false;
		this.#fail = (a, o, e) => {
			throw new ExpectationFailedError(serialize(a), `${this.#negated ? 'not ' : ''}${o}`, serialize(e));
		};
	}

	public get not(): Expect<T> {
		const expect = new Expect(this.#value);
		expect.#negated = !this.#negated;
		return expect;
	}

	public toBe(expected: any): void {
		if ((this.#value === expected) === this.#negated) {
			this.#fail(this.#value, 'to be', expected);
		}
	}

	public async toThrow(): Promise<void> {
		try {
			await (this.#value as () => unknown)();
			if (this.#negated) throw new ExpectationFailedError('Function', 'not to throw', '');
		} catch (ex) {
			if (!this.#negated) throw new ExpectationFailedError('Function', 'to throw', '');
		}
	}

	public toStrictEqual(expected: any): void {
		if ((serialize(this.#value) === serialize(expected)) === this.#negated) {
			this.#fail(this.#value, 'to strictly equal', expected);
		}
	}

	public toBeDefined(): void {
		this.not.toBe(undefined);
	}

	public toBeUndefined(): void {
		this.toBe(undefined);
	}

	public toBeNull(): void {
		this.toBe(null);
	}

	public toBeCalledWith(...args: unknown[]): void {
		const actual = getArgumentsCalledWith(this.#value);
		const expected = args;

		if ((serialize(actual) === serialize(expected)) === this.#negated) {
			this.#fail(actual, 'to be called with', expected);
		}
	}

	public toBeCalledTimes(times: number): void {
		const actual = getTimesCalled(this.#value)
		const expected = times;

		if ((actual === expected) === this.#negated) {
			this.#fail(actual, 'to be called times', expected);
		}
	}
}
