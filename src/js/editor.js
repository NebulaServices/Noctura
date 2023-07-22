import { css } from "@codemirror/lang-css";
import {
  javascript,
  javascriptLanguage,
  scopeCompletionSource
} from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView, basicSetup } from "codemirror";

function createEditor(lang) {
  if (lang === "css") {
    return new EditorView({
      extensions: [basicSetup, vscodeDark, css()],
      parent: document.querySelector("#monaco-editor")
    });
  } else if (lang === "js") {
    return new EditorView({
      extensions: [
        basicSetup,
        vscodeDark,
        javascript(),
        javascriptLanguage.data.of({
          autocomplete: scopeCompletionSource(globalThis)
        })
      ],
      parent: document.querySelector("#monaco-editor"),
      // it has to look like that so it renders properly in the element
      doc: `/*
    Select an option above.
*/`
    });
  }
}

export default createEditor;
