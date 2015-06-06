'use babel';
import {Subscriber} from 'emissary';
import editorconfig from 'editorconfig';

Subscriber.extend(exports);

function init(editor) {
	if (!editor) {
		return;
	}

	const file = editor.getURI();

	if (!file) {
		return;
	}

	editorconfig.parse(file).then(config => {
		if (Object.keys(config).length === 0) {
			return;
		}

		const isTab = config.indent_style === 'tab' || !editor.softTabs;

		if (isTab) {
			editor.setSoftTabs(false);

			if (config.tab_width) {
				editor.setTabLength(config.tab_width);
			}
		} else {
			editor.setSoftTabs(true);

			if (config.indent_size) {
				editor.setTabLength(config.indent_size);
			}
		}

		if (config.charset) {
			// EditorConfig charset names matches iconv charset names.
			// Which is used by Atom. So no charset name convertion is needed.
			editor.setEncoding(config.charset);
		}
	});
}

export let activate = () => {
	atom.workspace.observeTextEditors(init);
};
