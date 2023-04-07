/**
 * @jest-environment <rootDir>/src/environment.ts
 *
 * @obsidian-conformance strict
 * @obsidian-jest-ignore node-must-be-within-document
 * @obsidian-jest-ignore set-css-styles-does-not-set-unknown-properties
 * @obsidian-jest-ignore set-css-styles-does-not-set-variables
 */
import 'obsidian';

import { beforeEach, describe, expect, test } from '@jest/globals';

import { withElementInDocument } from '../../testutil/utils';

describe('fish', () => {
	test('returns selection', () => {
		const el: HTMLElement = (
			<div>
				<div id="target" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = el.querySelector('#target')! as HTMLElement;
			expect(fish("#target")).toBe(target);
		});
	});

	test('returns null', () => {
		const el: HTMLElement = (
			<div>
			</div>
		);

		withElementInDocument(el, () => {
			expect(fish("unknown")).toBeNull();
		});
	});
});

describe('fishAll', () => {
	test('returns single', () => {
		const el: HTMLElement = (
			<div>
				<div id="target" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = Array.from(el.querySelectorAll('#target')) as HTMLElement[];
			expect(fishAll("#target")).toStrictEqual(target);
		});
	});

	test('returns multiple', () => {
		const el: HTMLElement = (
			<div>
				<div className="target" />
				<div className="target" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = Array.from(el.querySelectorAll('.target')) as HTMLElement[];
			expect(fishAll(".target")).toStrictEqual(target);
		});
	});


	test('returns empty', () => {
		const el: HTMLElement = (
			<div>
			</div>
		);

		withElementInDocument(el, () => {
			expect(fishAll("not-a-tag")).toStrictEqual([]);
		});
	});
});

test('isBoolean', () => {
	expect(isBoolean(true)).toBe(true);
	expect(isBoolean(false)).toBe(true);

	expect(isBoolean("true")).toBe(false);
	expect(isBoolean(1)).toBe(false);
	expect(isBoolean(() => {})).toBe(false);
	expect(isBoolean(null)).toBe(false);
	expect(isBoolean(undefined)).toBe(false);
});
