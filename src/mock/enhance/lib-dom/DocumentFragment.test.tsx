/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import 'obsidian';

import { describe, expect, test } from '@jest/globals';

describe('find', () => {
	test('simple selector', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="target"></div>
			</div>
		);

		const target = el.querySelector('#target');
		expect(target).toBeDefined();
		expect(el.find('#target')).toBe(target);
	});

	test('complicated selector', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="parent">
					<div id="target" className="class"></div>
				</div>
			</div>
		);

		const target = el.querySelector('#target');
		expect(target).toBeDefined();
		expect(el.find('#parent > #target.class')).toBe(target);
	});

	test('no matches', () => {
		const el: HTMLDivElement = <div></div>;

		expect(el.find('#target')).toBeNull();
	});
});

describe('findAll', () => {
	test('multiple matches', () => {
		const el: HTMLDivElement = (
			<div>
				<div className="target"></div>
				<div className="target"></div>
			</div>
		);

		const target = Array.from(el.querySelectorAll('.target'));
		expect(el.findAll('.target')).toStrictEqual(target);
	});

	test('single match', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="target"></div>
			</div>
		);

		expect(el.findAll('#target')).toStrictEqual([el.querySelector('#target')]);
	});

	test('no matches', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="target"></div>
			</div>
		);

		expect(el.findAll('#no-target')).toStrictEqual([]);
	});

	test('complicated selector', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="parent">
					<div id="foo" className="class"></div>
					<div id="bar" className="class"></div>
				</div>
			</div>
		);

		const target = Array.from(el.querySelectorAll('.class'));
		expect(target).not.toStrictEqual([]);
		expect(el.findAll('#parent > div.class')).toStrictEqual(target);
	});
});
