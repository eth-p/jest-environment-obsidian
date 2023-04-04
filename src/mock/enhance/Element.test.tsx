/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import 'obsidian';

import { beforeEach, describe, expect, test } from '@jest/globals';

describe('getText', () => {
	test('single node', () => {
		const el: HTMLDivElement = <div>foo</div>;
		expect(el.getText()).toBe('foo');
	});

	test('multiple nodes', () => {
		const el: HTMLDivElement = (
			<div>
				foo
				<span>bar</span>
				<button>baz</button>
			</div>
		);

		expect(el.getText()).toBe('foobarbaz');
	});

	test('contains fragment', () => {
		const frag: HTMLDivElement = (
			<div>
				foo
				<>
					<span>bar</span>
					baz
				</>
			</div>
		);

		expect(frag.getText()).toBe('foobarbaz');
	});
});

describe('setText', () => {
	test('string', () => {
		const el: HTMLDivElement = <div>foo</div>;

		el.setText('bar');
		expect(el.textContent).toBe('bar');
	});

	test('fragment', () => {
		const el: HTMLDivElement = <div>foo</div>;

		el.setText(
			<>
				<div>foo</div>
				<span>bar</span>
				baz
			</>,
		);

		expect(el.getText()).toBe('foobarbaz');
	});
});

describe('addClass', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div />;
	});

	test('none', () => {
		el.addClass();

		expect(el.classList.length).toBe(0);
	});

	test('single', () => {
		el.addClass('foo');

		expect(el.classList.length).toBe(1);
		expect(el.classList.contains('foo')).toBe(true);
	});

	test('multiple', () => {
		el.addClass('foo', 'bar');

		expect(el.classList.length).toBe(2);
		expect(el.classList.contains('foo')).toBe(true);
		expect(el.classList.contains('bar')).toBe(true);
	});
});
