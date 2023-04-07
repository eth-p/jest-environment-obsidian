import { ButtonComponent, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { allTests } from './joker-registry';
import { TestRunner } from './joker-runner';
import { Test, TestResult } from './joker-test';
import TestComponent from './test-component';
import './tests';

export default class TestPlugin extends Plugin {
	public runner!: TestRunner;

	public async onload(): Promise<void> {
		this.runner = new TestRunner();
		this.addSettingTab(new TestPluginSettingTab(this));
	}
}

class TestPluginSettingTab extends PluginSettingTab {
	private readonly components: Map<string, TestComponent> = new Map();
	private summarySetting: Setting;
	private componentsContainer!: HTMLDivElement;
	private runner: TestRunner;
	private isRunning: boolean;

	constructor(plugin: TestPlugin) {
		super(plugin.app, plugin);
		this.runner = plugin.runner;
		this.isRunning = false;
	}

	private _init(this: TestPluginSettingTab) {
		const frag = document.createDocumentFragment();
		this.componentsContainer = frag.createDiv();

		for (const test of allTests()) {
			const testComponent = new TestComponent()
				.setPath(test.suite?.toPath())
				.setDesc(test.description)
				.setTest(test);

			this.components.set(test.toPath(), testComponent);
			this.componentsContainer.appendChild(testComponent.componentEl);
		}
	}

	protected _updateProgress(results: Array<[Test, TestResult]>) {
		for (const [test, result] of results) {
			this.components.get(test.toPath())?.setResult(result);
		}
	}

	protected _updateResults(results: Map<Test, TestResult>) {
		const passed = Array.from(results.values()).filter((r) => r.passed).length;
		const failed = Array.from(results.values()).filter((r) => !r.passed).length;

		if (failed === 0) {
			this.summarySetting.setName('Results').setDesc('All tests passed!');
			return;
		}

		this.summarySetting.setName('Results').setDesc(`${failed} of ${results.size} tests failed.`);
	}

	/** @override */
	public display() {
		this._init();

		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Run Tests')
			.setDesc('Run the jest-environment-obsidian tests under Obsidian')
			.setDisabled(this.isRunning)
			.addButton((btn) => {
				btn.setButtonText('Run Tests').onClick(() => {
					btn.setDisabled(true);
					this.isRunning = true;
					this.runner.runTests(allTests(), this._updateProgress.bind(this)).then((results) => {
						btn.setDisabled(false);
						this.isRunning = false;
						this._updateProgress(Array.from(results.entries()));
						this._updateResults(results);
					});
				});
			});

		this.summarySetting = new Setting(containerEl).setDesc('Press the button above to run tests.');

		containerEl.appendChild(this.componentsContainer);
	}
}
