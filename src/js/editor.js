import { Editor } from 'https://esm.sh/@tiptap/core@2.1.12'
import { TextSelection } from 'prosemirror-state';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.1.12'
import anime from 'https://esm.sh/animejs@3.2.1';
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

    // Use a transaction to insert the new text
    editor.chain().focus().insertContent(text).run();

    // Apply fade-in animation to newly added text
    const lastChild = editor.view.dom.lastChild;
    if (lastChild) {
      lastChild.classList.add('new-text-fade-in');
      anime({
        targets: lastChild,
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
          lastChild.classList.remove('new-text-fade-in');
        }
      });
    }

      const selection = TextSelection.atEnd(editor.state.doc)
    const cursorTransaction = editor.state.tr.setSelection(selection);
    editor.view.dispatch(cursorTransaction);







    




}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeEditor);

// Export editor for use in other scripts if needed
export { editor };
export { initializeEditor };
export { appendTextToEditor };
