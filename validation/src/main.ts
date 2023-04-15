import '#validation-tests';
import {
	ButtonComponent,
	ExtraButtonComponent,
	Plugin,
	PluginSettingTab,
	SearchComponent,
	Setting,
	prepareSimpleSearch,
} from 'obsidian';

import { allFiles, allTests } from './joker-registry';
import { TestRunner } from './joker-runner';
import { Test, TestFile, TestResult, TestSuite } from './joker-test';
import TestComponent from './test-component';

export default class TestPlugin extends Plugin {
	public runner!: TestRunner;
	public shouldRunTests: boolean;
	public config: {
		lastSearch: string;
		lastFiltered: boolean;
	};

	public async onload(): Promise<void> {
		this.config = {
			lastSearch: '',
			lastFiltered: false,
			...((await this.loadData()) ?? {}),
		};

		this.runner = new TestRunner();
		this.addSettingTab(new TestPluginSettingTab(this));
	}

	public updateConfig<F extends keyof TestPlugin['config']>(k: F, value: this['config'][F]) {
		this.config[k] = value;
		this.saveData(this.config);
	}

	public async reloadPlugin(runTests?: boolean) {
		const plugins = (this.app as any).plugins as {
			unloadPlugin(id: string): Promise<void>;
			loadPlugin(id: string): Promise<void>;
			getPlugin(id: string): Plugin;
		};

		await plugins.unloadPlugin(this.manifest.id);
		await plugins.loadPlugin(this.manifest.id);

		if (runTests) {
			const settings = (this.app as any).setting as {
				openTabById(id: string);
			};

			(plugins.getPlugin(this.manifest.id) as TestPlugin).shouldRunTests = true;
			settings.openTabById(this.manifest.id);
		}
	}
}

class TestPluginSettingTab extends PluginSettingTab {
	private readonly plugin: TestPlugin;
	private readonly components: Map<Test, TestComponent> = new Map();
	private readonly componentGroups: Set<HTMLDivElement> = new Set();

	private summarySetting: Setting;
	private componentsContainer!: HTMLDivElement;
	private runner: TestRunner;
	private isRunning: boolean;

	private searchQuery: string;
	private onlyShowFailed: boolean;

	private filterButton!: ExtraButtonComponent;
	private runButton!: ButtonComponent;
	private searchForm!: SearchComponent;

	constructor(plugin: TestPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
		this.runner = plugin.runner;
		this.isRunning = false;
	}

	private _createComponentForTest(test: Test): HTMLElement {
		const component = new TestComponent().setDesc(test.description).setTest(test);

		this.components.set(test, component);
		return component.componentEl;
	}

	private _createComponentsForFile(file: TestFile): HTMLElement {
		const containerEl = createDiv('jest-environment-obsidian-testui-file');
		const filePath = file.description.replace(/\\/g, '/');
		const fileName = filePath.replace(/^(.*?)([^\/]+)$/, '$2');
		const fileDir = filePath.replace(/^(.*?)([^\/]+)$/, '$1');

		// Create the header.
		const header = containerEl.createEl('h2');
		header.createSpan({ cls: 'jest-environment-obsidian-testui-filepath-dir', text: fileDir });
		header.createSpan({ cls: 'jest-environment-obsidian-testui-filepath-name', text: fileName });

		// Create the components.
		const contentEl = containerEl.createDiv();
		for (const test of file.tests.values()) {
			contentEl.appendChild(this._createComponentForTest(test));
		}

		for (const suite of file.suites.values()) {
			contentEl.appendChild(this._createComponentsForSuite(suite, 0));
		}

		this.componentGroups.add(containerEl);
		return containerEl;
	}

	private _createComponentsForSuite(suite: TestSuite, depth: number): HTMLElement {
		const containerEl = createDiv('jest-environment-obsidian-testui-group');
		containerEl.createEl(`h${depth + 3}` as any, {
			cls: 'jest-environment-obsidian-testui-suite',
			text: suite.description,
		});

		for (const test of suite.tests.values()) {
			containerEl.appendChild(this._createComponentForTest(test));
		}

		this.componentGroups.add(containerEl);
		return containerEl;
	}

	private _init(this: TestPluginSettingTab) {
		const frag = document.createDocumentFragment();
		this.componentsContainer = frag.createDiv('jest-environment-obsidian-testui-scrollable');
		this.componentGroups.clear();

		const files = allFiles().sort((a, b) => a.description.localeCompare(b.description));
		for (const file of files) {
			this.componentsContainer.appendChild(this._createComponentsForFile(file));
		}
	}

	protected _updateProgress(results: Array<[Test, TestResult]>) {
		for (const [test, result] of results) {
			this.components.get(test)?.setResult(result);
		}
	}

	protected _updateResults(results: Map<Test, TestResult>) {
		this._updateComponentVisibility();
		const passed = Array.from(results.values()).filter((r) => r.passed).length;
		const failed = Array.from(results.values()).filter((r) => !r.passed).length;

		if (failed === 0) {
			this.summarySetting.setName('Results').setDesc('All tests passed!');
			return;
		}

		this.summarySetting
			.setName('Results')
			.setDesc(`${failed} of ${results.size} tests failed.`)
			.then((s) => s.descEl.setAttr('style', 'color: var(--text-error)'));
	}

	protected _updateComponentVisibility() {
		const { onlyShowFailed, searchQuery } = this;
		const visible = new Set(this.components.values());

		// Hide based on filter.
		if (onlyShowFailed) {
			for (const component of visible) {
				if (component.run && component.passed) {
					visible.delete(component);
				}
			}
		}

		// Hide based on search.
		if (searchQuery) {
			const search = prepareSimpleSearch(this.searchQuery);
			for (const component of visible) {
				if (search(component.test.toPath()) == null) {
					visible.delete(component);
				}
			}
		}

		// Update visibilities.
		for (const component of this.components.values()) component.componentEl.hide();
		for (const component of visible) component.componentEl.show();

		// Update collapsed groups.
		for (const group of this.componentGroups.values()) {
			this._updateCollapsedGroup(group);
		}
	}

	/**
	 * Hides or shows a group depending on if its components are filtered out.
	 */
	protected _updateCollapsedGroup(group: HTMLDivElement) {
		for (const el of group.querySelectorAll('.jest-environment-obsidian-test-component')) {
			if ((el as HTMLElement).style.getPropertyValue('display') !== 'none') {
				group.show();
				return;
			}
		}

		group.hide();
	}

	protected setSearch(query: string) {
		this.plugin.updateConfig('lastSearch', query);
		this.searchQuery = query;

		window.requestAnimationFrame(() => {
			this._updateComponentVisibility();
		});
	}

	public setFilter(onlyShowFailed: boolean) {
		this.plugin.updateConfig('lastFiltered', onlyShowFailed);

		this.onlyShowFailed = onlyShowFailed;
		this.filterButton.setIcon(onlyShowFailed ? 'lucide-eye' : 'lucide-filter');

		window.requestAnimationFrame(() => {
			this._updateComponentVisibility();
		});
	}

	public runTests(): Promise<void> {
		return new Promise((resolve) => {
			this.isRunning = true;
			this.runner.runTests(allTests(), this._updateProgress.bind(this)).then((results) => {
				this.runButton.setDisabled(false);
				this.isRunning = false;
				this._updateProgress(Array.from(results.entries()));
				this._updateResults(results);
				resolve();
			});
		});
	}

	/** @override */
	public display() {
		this._init();

		const { containerEl } = this;
		containerEl.empty();
		containerEl.classList.add('jest-environment-obsidian-testui-container');
		const controlsEl = containerEl.createDiv({
			cls: ['vertical-tab-content', 'jest-environment-obsidian-testui-controls'],
		});

		this.summarySetting = new Setting(controlsEl)
			.setName('No Tests Run')
			.setDesc('Press the button below to run tests.')
			.addSearch((search) => {
				this.searchForm = search;
				search.onChange(this.setSearch.bind(this));
				search.setValue(this.plugin.config.lastSearch)
				this.setSearch(this.plugin.config.lastSearch);
			})
			.addExtraButton((btn) => {
				this.filterButton = btn;
				btn.onClick(() => this.setFilter(!this.onlyShowFailed));
				this.setFilter(this.plugin.config.lastFiltered);
			});

		// Some info about this tab.
		const desc = document.createDocumentFragment();
		desc.createDiv('jest-environment-obsidian-testui-about', (el) => {
			el.createEl('p', { text: `There are ${allTests().length} tests across ${allFiles().length} files.` });
		});

		controlsEl.appendChild(desc);

		// The run button.
		const runButtonHandler = async () => {
			await this.runTests();

			this.runButton.setButtonText("Reload & Run Tests");
			this.runButton.onClick(() => this.plugin.reloadPlugin(true));
		};

		this.runButton = new ButtonComponent(controlsEl).setButtonText('Run Tests').onClick(runButtonHandler);

		// The test results.
		this.componentsContainer.classList.add('vertical-tab-content');
		containerEl.appendChild(this.componentsContainer);

		// Automatically run tests?
		if (this.plugin.shouldRunTests) {
			runButtonHandler();
		}
	}
}
