/**
 * Error thrown when an expectation fails.
 */
export class ExpectationFailedError extends Error {
	public readonly valueExpected: string;
	public readonly valueReceived: string;
	public readonly expectation: string;

	public constructor(expected: string, operator: string, actually: string) {
		super(`Expected \`${expected}\` ${operator}, but got \`${actually}\``);
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

function serialize(value: any): string {
	return JSON.stringify(value);
}

export class Expect<T> {
	#value: T;
	#negated: boolean;

	public constructor(value: T) {
		this.#value = value;
		this.#negated = false;
	}

	public get not(): Expect<T> {
		const expect = new Expect(this.#value);
		expect.#negated = !this.#negated;
		return expect;
	}

	public toBe(value: any): void {
		if ((this.#value === value) === this.#negated) {
			throw new ExpectationFailedError(value, 'to be', serialize(this.#value));
		}
	}

	public toStrictEqual(value: any): void {
		if ((serialize(this.#value) === serialize(value)) === this.#negated) {
			throw new ExpectationFailedError(value, 'to strictly equal', serialize(this.#value));
		}
	}
}
