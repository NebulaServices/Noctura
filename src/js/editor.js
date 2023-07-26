import { EditorView, basicSetup } from "codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript, javascriptLanguage, scopeCompletionSource } from "@codemirror/lang-javascript";
// import proxyCompletions from "./proxyCompletions";
import { css } from "@codemirror/lang-css";

const scopedAutocomplete = javascriptLanguage.data.of({ autocomplete: scopeCompletionSource(globalThis) });
// const proxyAutocomplete = javascriptLanguage.data.of({ autocomplete: proxyCompletions });

function createEditor(lang) {
    if (lang === "css") {
        return new EditorView({
            extensions: [basicSetup, vscodeDark, css()],
            parent: document.querySelector("#monaco-editor")
        });
    } else if (lang === "js") {
        return new EditorView({
            extensions: [basicSetup, vscodeDark, javascript(), scopedAutocomplete, /* proxyAutocomplete */],
            parent: document.querySelector("#monaco-editor"),
            // it has to look like that so it renders properly in the element
            doc:`/*
    Select an option above.
    note: scripts that have no option will be ran in the current context when save is pressed
*/`
    });
  }
}

export default createEditor;