import { __UNIMPLEMENTED__ } from '#runtime';
import type { Extension } from '@codemirror/state';
import type {
	App,
	Command,
	EditorSuggest,
	HoverLinkSource,
	MarkdownPostProcessor,
	MarkdownPostProcessorContext,
	ObsidianProtocolHandler,
	PluginManifest,
	PluginSettingTab,
	ViewCreator,
} from 'obsidian';

import { Component } from '../components/Component';

export abstract class Plugin_2 extends Component {
	public app: App;
	public manifest: PluginManifest;

	public constructor(app: App, manifest: PluginManifest) {
		super();
		this.app = app;
		this.manifest = manifest;
	}

	/**
	 * Adds a ribbon icon to Obsidian's left bar.
	 */
	public addRibbonIcon(icon: string, title: string, callback: (evt: MouseEvent) => any): HTMLElement {
		__UNIMPLEMENTED__();
	}

	/**
	 * ???
	 */
	public addStatusBarItem(): HTMLElement {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a command.
	 * The command id and name will be automatically prefixed with this plugin's id and name.
	 */
	public addCommand(command: Command): Command {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a setting tab for this plugin.
	 */
	public addSettingTab(settingTab: PluginSettingTab): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a view type.
	 */
	public registerView(type: string, viewCreator: ViewCreator): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a view with the 'Page preview' core plugin.
	 */
	public registerHoverLinkSource(id: string, info: HoverLinkSource): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a file extension to be opened with the given view type.
	 */
	public registerExtensions(extensions: string[], viewType: string): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a markdown post-processor.
	 */
	public registerMarkdownPostProcessor(
		postProcessor: MarkdownPostProcessor,
		sortOrder?: number,
	): MarkdownPostProcessor {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a special post processor that handles fenced code given a language and a handler.
	 */
	public registerMarkdownCodeBlockProcessor(
		language: string,
		handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void,
		sortOrder?: number,
	): MarkdownPostProcessor {
		__UNIMPLEMENTED__();
	}

	/**
	 * Runs callback for all currently loaded instances of CodeMirror 5, and any future instances.
	 */
	public registerCodeMirror(callback: (cm: CodeMirror.Editor) => any): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a CodeMirror 6 extension.
	 */
	public registerEditorExtension(extension: Extension): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers a handler for `obsidian://` URLs.
	 */
	public registerObsidianProtocolHandler(action: string, handler: ObsidianProtocolHandler): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * Registers an EditorSuggest which can provide live suggestions while the user is typing.
	 */
	public registerEditorSuggest(editorSuggest: EditorSuggest<any>): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * Loads JSON-serializable data from a file.
	 */
	public async loadData(): Promise<any> {
		__UNIMPLEMENTED__();
	}

	/**
	 * Saves JSON-serializable data to a file.
	 */
	public async saveData(data: any): Promise<void> {
		__UNIMPLEMENTED__();
	}
}
