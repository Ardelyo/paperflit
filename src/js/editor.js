import { Editor } from 'https://esm.sh/@tiptap/core@2.1.12'
import { TextSelection } from 'prosemirror-state';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.1.12'
import Underline from 'https://esm.sh/@tiptap/extension-underline@2.1.12'
import TextAlign from 'https://esm.sh/@tiptap/extension-text-align@2.1.12'
import CharacterCount from 'https://esm.sh/@tiptap/extension-character-count@2.1.12'

let editor = null;

function initializeEditor() {
    // Target the correct element for the editor content
    const editorElement = document.getElementById('editor-content'); 
    
    if (!editorElement) {
        console.error('Editor content element (#editor-content) not found.');
        return null;
    }

    editor = new Editor({
        element: editorElement,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            CharacterCount
        ],
        content: '',
        editable: true,
    });
    
    return editor;
}

function appendTextToEditor(text) {
  if (!editor) {
      console.error('Editor not initialized.');
      return;
  }

    // Create a new text node with the incoming text
    const newNode = editor.state.schema.text(text);

    // Get the current document's end position
    const endOfDoc = editor.state.doc.content.size;

    // Create a transaction to insert the new text
    const tr = editor.state.tr.insert(endOfDoc, newNode);

    // Apply the transaction to the editor
    editor.view.dispatch(tr);

    // Move the cursor to the end of the newly inserted text
    const newCursorPos = endOfDoc + text.length;
    const selection = TextSelection.near(editor.state.doc.resolve(newCursorPos));
    const cursorTransaction = editor.state.tr.setSelection(selection);
    editor.view.dispatch(cursorTransaction);


}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeEditor);

// Export editor for use in other scripts if needed
export { editor };
export { initializeEditor };
export { appendTextToEditor };
