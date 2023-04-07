/**
 * @jest-environment <rootDir>/src/environment.ts
 *
 * @obsidian-conformance strict
 * @obsidian-jest-ignore set-css-styles-does-not-set-unknown-properties
 * @obsidian-jest-ignore set-css-styles-does-not-set-variables
 */
import 'obsidian';

import { beforeEach, describe, expect, test } from '@jest/globals';



describe('setCssStyles', () => {
	let el!: SVGElement;
	beforeEach(() => {
		el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	});

	test('not a string', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			width: 3,
		});

		expect(el.style.width).toBe('3px');
	});

	test('not a valid property', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			'-not-valid': '1em',
		});

		expect((el.style as unknown as Record<string, string>)['-not-valid']).toBe('1em');
		expect(el.style.getPropertyValue('-not-valid')).toBe('');
	});

	test('not a valid property or string', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			widthy: 3,
		});

		expect((el.style as unknown as Record<string, string>)["widthy"]).toBe(3);
		expect(el.style.getPropertyValue("widthy")).toBe('');
	});

	test('is a css variable property', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			'--my-var': '1em',
		});

		expect((el.style as unknown as Record<string, string>)['--my-var']).toBe('1em');
		expect(el.style.getPropertyValue('--my-var')).toBe('');
	});

	test('valid properties', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			width: '3px',
			height: '6px',
		});

		expect(el.style.width).toBe('3px');
		expect(el.style.height).toBe('6px');
	});
});

describe('setCssProps', () => {
	let el!: SVGElement;
	beforeEach(() => {
		el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	});

	test('not a string', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssProps({
			width: 3,
		});

		expect(el.style.width).toBe('3px');
	});

	test('not a valid property', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssProps({
			'-not-valid': '1em',
		});

		expect((el.style as unknown as Record<string, string>)['-not-valid']).toBe(undefined);
		expect(el.style.getPropertyValue('-not-valid')).toBe('');
	});

	test('not a valid property or string', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssProps({
			widthy: 3,
		});

		expect((el.style as unknown as Record<string, string>)["widthy"]).toBe(undefined);
		expect(el.style.getPropertyValue("widthy")).toBe('');
	});

	test('valid properties', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssProps({
			width: '3px',
			height: '6px',
		});

		expect(el.style.width).toBe('3px');
		expect(el.style.height).toBe('6px');
	});
});
