import { Editor } from 'https://esm.sh/@tiptap/core@2.1.12'
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
        autofocus: true,
        editable: true,
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeEditor);

// Export editor for use in other scripts if needed
export { editor };
