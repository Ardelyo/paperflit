// editorSetup.js - Handles TipTap editor initialization and toolbar logic

import { Editor } from 'https://esm.sh/@tiptap/core@2.4.0'; // Updated version
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.4.0';
import Underline from 'https://esm.sh/@tiptap/extension-underline@2.4.0';
import TextAlign from 'https://esm.sh/@tiptap/extension-text-align@2.4.0';
import CharacterCount from 'https://esm.sh/@tiptap/extension-character-count@2.4.0';

let editor = null;
let toolbarElement = null;
let wordCountDisplay = null;

/**
 * Updates the visual state (active/inactive) of toolbar buttons
 * based on the current editor selection and active marks/nodes.
 */
function updateToolbarActiveState() {
    if (!toolbarElement || !editor) return;

    document.querySelectorAll('#formatting-toolbar button[data-command]').forEach(button => {
        const command = button.dataset.command;
        let isActive = false;

        // Check active state based on command
        switch (command) {
            case 'toggleBold':          isActive = editor.isActive('bold'); break;
            case 'toggleItalic':        isActive = editor.isActive('italic'); break;
            case 'toggleUnderline':     isActive = editor.isActive('underline'); break;
            case 'toggleStrike':        isActive = editor.isActive('strike'); break;
            case 'toggleBulletList':    isActive = editor.isActive('bulletList'); break;
            case 'toggleOrderedList':   isActive = editor.isActive('orderedList'); break;
            case 'toggleBlockquote':    isActive = editor.isActive('blockquote'); break;
            case 'toggleCodeBlock':     isActive = editor.isActive('codeBlock'); break;
            case 'setParagraph':        isActive = editor.isActive('paragraph'); break;
            case 'toggleHeading':
                const level = button.dataset.level ? parseInt(button.dataset.level, 10) : null;
                if (level) isActive = editor.isActive('heading', { level: level });
                break;
            case 'setTextAlign':
                const value = button.dataset.value;
                if (value) isActive = editor.isActive({ textAlign: value });
                break;
            // Handle disable/enable for undo/redo separately
            case 'undo':
                button.disabled = !editor.can().undo();
                return; // Skip active class toggle
            case 'redo':
                button.disabled = !editor.can().redo();
                return; // Skip active class toggle
            default: break;
        }

        // Apply or remove the 'is-active' class
        if (isActive) {
            button.classList.add('is-active');
        } else {
            button.classList.remove('is-active');
        }
    });

    // Ensure undo/redo buttons are updated even if not iterated above
    const undoBtn = toolbarElement.querySelector('button[data-command="undo"]');
    const redoBtn = toolbarElement.querySelector('button[data-command="redo"]');
    if (undoBtn) undoBtn.disabled = !editor.can().undo();
    if (redoBtn) redoBtn.disabled = !editor.can().redo();
}

/**
 * Updates the word count display based on editor content.
 */
function updateWordCount() {
    if (!editor || !editor.storage.characterCount || !wordCountDisplay) {
        if(wordCountDisplay) wordCountDisplay.textContent = '0 words';
        return;
    }
    const count = editor.storage.characterCount.words();
    wordCountDisplay.textContent = `${count} words`;
}

/**
 * Sets up event listeners for the formatting toolbar buttons.
 */
function setupToolbarListeners() {
    if (!toolbarElement) return;

    toolbarElement.addEventListener('click', (e) => {
        const button = e.target.closest('button.toolbar-button');
        if (!button || !editor) return;

        const command = button.dataset.command;
        const level = button.dataset.level ? parseInt(button.dataset.level, 10) : null;
        const value = button.dataset.value; // For alignment

        let commandChain = editor.chain().focus(); // Always refocus

        // Execute the corresponding editor command
        switch (command) {
            case 'toggleBold':
            case 'toggleItalic':
            case 'toggleUnderline':
            case 'toggleStrike':
            case 'toggleBulletList':
            case 'toggleOrderedList':
            case 'toggleBlockquote':
            case 'toggleCodeBlock':
            case 'setParagraph':
                if (commandChain[command]) commandChain[command]().run();
                break;
            case 'toggleHeading':
                if (level && commandChain.toggleHeading) commandChain.toggleHeading({ level: level }).run();
                break;
            case 'setTextAlign':
                if (value && commandChain.setTextAlign) commandChain.setTextAlign(value).run();
                break;
            case 'undo':
                if (commandChain.undo) commandChain.undo().run();
                break;
            case 'redo':
                if (commandChain.redo) commandChain.redo().run();
                break;
            default:
                console.warn("Unknown toolbar command:", command);
        }
        // No need to manually call updateToolbarActiveState here,
        // the editor 'update' event will trigger it.
    });
}

/**
 * Initializes the TipTap editor instance.
 * @param {string} editorElementId - The ID of the element to attach the editor to.
 * @param {string} toolbarElementId - The ID of the formatting toolbar element.
 * @param {string} wordCountElementId - The ID of the word count display element.
 * @returns {Editor|null} The initialized editor instance or null if failed.
 */
export function initializeEditor(editorElementId, toolbarElementId, wordCountElementId) {
    const editorElement = document.getElementById(editorElementId);
    toolbarElement = document.getElementById(toolbarElementId); // Assign to module scope
    wordCountDisplay = document.getElementById(wordCountElementId); // Assign to module scope

    if (!editorElement) {
        console.error(`Editor content element (#${editorElementId}) not found.`);
        return null;
    }
     if (!toolbarElement) {
        console.warn(`Toolbar element (#${toolbarElementId}) not found.`);
        // Proceed without toolbar listeners if not found
    }
     if (!wordCountDisplay) {
        console.warn(`Word count display element (#${wordCountElementId}) not found.`);
        // Proceed without word count if not found
    }

    try {
        editor = new Editor({
            element: editorElement,
            extensions: [
                StarterKit,
                Underline,
                TextAlign.configure({
                    types: ['heading', 'paragraph'], // Apply alignment to headings and paragraphs
                }),
                CharacterCount // Add character count extension
            ],
            content: `
                <h1>Welcome to Magic Text Editor!</h1>
                <p>Start typing your masterpiece here. Use the toolbar above for formatting.</p>
                <p>Toggle the <strong>AI Tools sidebar</strong> using the menu button on the right to access powerful writing assistance features.</p>
                <p><em>Remember to enter your OpenRouter API key in the sidebar to enable AI tools.</em></p>
            `,
            autofocus: true,
            editable: true,
        });

        // Listen for editor updates to refresh toolbar state and word count
        editor.on('update', () => {
            updateToolbarActiveState();
            updateWordCount();
        });
         editor.on('selectionUpdate', () => { // Also update on selection change
            updateToolbarActiveState();
        });

        // Set up toolbar button listeners
        if (toolbarElement) {
            setupToolbarListeners();
        }

        // Set initial state for toolbar and word count
        updateToolbarActiveState();
        updateWordCount();

        console.log("TipTap Editor Initialized Successfully.");
        return editor; // Return the instance

    } catch (error) {
        console.error('Error initializing TipTap Editor:', error);
        editor = null; // Ensure editor is null on failure
        return null;
    }
}

// Export the editor instance (it will be null until initialized)
// It's better practice for main.js to call initializeEditor and store the returned instance.
export { editor };
