// notesManager.js - Handles all logic for the sidebar notes feature

// Import TipTap Core and StarterKit for rich text editing
import { Editor } from 'https://esm.sh/@tiptap/core@2.4.0';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.4.0';

const NOTES_STORAGE_KEY = 'sidebarNotes';
let notes = []; // Array to hold note objects { id, title, content, pinned, order, createdAt, updatedAt }
let noteEditorInstance = null; // Holds the TipTap instance for the note body
let currentEditingNoteId = null; // Track which note is being edited
let saveTimeout = null; // For debouncing auto-save
let draggedNoteId = null; // Track the ID of the note being dragged

// DOM Elements
const notesListContainer = document.getElementById('notes-list');
const addNoteBtn = document.getElementById('add-note-btn');
const noteEditorContainer = document.getElementById('note-editor-container');
const noteTitleInput = document.getElementById('note-title-input');
const noteBodyEditorEl = document.getElementById('note-body-editor'); // Target element for TipTap
const closeNoteEditorBtn = document.getElementById('close-note-editor-btn');
const noNotesMessage = document.querySelector('#notes .no-notes-message');

/** Generates a unique ID. */
function generateNoteId() {
    return `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/** Loads notes from localStorage. */
function loadNotes() {
    const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (storedNotes) {
        try {
            notes = JSON.parse(storedNotes);
            let maxOrder = -1;
            notes.forEach((note, index) => {
                note.pinned = note.pinned || false;
                note.createdAt = note.createdAt || Date.now();
                note.updatedAt = note.updatedAt || note.createdAt;
                if (note.order === undefined || note.order === null) note.order = index;
                if (note.order > maxOrder) maxOrder = note.order;
            });
            notes.sort((a, b) => a.order - b.order);
            notes.forEach((note, index) => note.order = index);
            sortNotesForDisplay();
        } catch (error) {
            console.error("Error parsing notes from localStorage:", error);
            notes = [];
        }
    } else {
        notes = [];
    }
    console.log("Notes loaded:", notes);
}

/** Saves notes to localStorage. */
function saveNotes() {
    try {
        notes.sort((a, b) => a.order - b.order);
        notes.forEach((note, index) => note.order = index);
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
        console.log("Notes saved.");
    } catch (error) {
        console.error("Error saving notes to localStorage:", error);
    }
}

/** Sorts notes for display: Pinned first (by order), then unpinned (by order). */
function sortNotesForDisplay() {
    notes.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return a.order - b.order;
    });
}

/** Finds a note by ID. */
function findNoteById(noteId) {
    return notes.find(note => note.id === noteId);
}

/** Finds the index of a note by ID. */
function findNoteIndexById(noteId) {
    return notes.findIndex(note => note.id === noteId);
}

/** Renders the list of notes. */
function renderNotesList() {
    if (!notesListContainer) return;
    const fragment = document.createDocumentFragment(); // Use fragment for performance
    sortNotesForDisplay();

    if (notes.length === 0) {
        if (noNotesMessage) {
            const msgClone = noNotesMessage.cloneNode(true);
            msgClone.style.display = 'block';
            fragment.appendChild(msgClone);
        } else {
             const p = document.createElement('p');
             p.style.cssText = 'color: var(--text-color-secondary); text-align: center; padding: 20px; font-style: italic;';
             p.textContent = 'No notes yet. Create one!';
             fragment.appendChild(p);
        }
    } else {
         if (noNotesMessage) noNotesMessage.style.display = 'none';
         notes.forEach(note => {
            const noteElement = createNoteListItem(note); // Now creates a card
            if (note.id === currentEditingNoteId) noteElement.classList.add('active');
            fragment.appendChild(noteElement);
        });
    }
    notesListContainer.innerHTML = ''; // Clear only once
    notesListContainer.appendChild(fragment); // Append fragment
}

/**
 * Extracts plain text from an HTML string.
 * @param {string} htmlString
 * @returns {string}
 */
function getPlainTextFromHtml(htmlString) {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
}

/** Creates a single note card element. */
function createNoteListItem(note) {
    const card = document.createElement('div');
    card.classList.add('note-card');
    card.dataset.noteId = note.id;
    card.draggable = true;
    if (note.pinned) card.classList.add('pinned');

    // --- NEW: Title Element ---
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('note-card-title');
    titleDiv.textContent = note.title || 'Untitled Note'; // Display title or placeholder

    // Content Preview
    const contentPreview = document.createElement('div');
    contentPreview.classList.add('note-card-content-preview');
    const plainText = getPlainTextFromHtml(note.content);
    const previewText = plainText.length > 80 ? plainText.substring(0, 80) + '...' : plainText; // Shorter preview
    // Show preview only if there's content, otherwise it looks empty below title
    contentPreview.textContent = plainText ? previewText : '';
    contentPreview.style.display = plainText ? 'block' : 'none'; // Hide if no content

    // Actions (Pin, Delete)
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('note-card-actions');

    const pinButton = document.createElement('button');
    pinButton.classList.add('pin-note-btn', 'material-button-icon');
    pinButton.title = note.pinned ? 'Unpin Note' : 'Pin Note';
    pinButton.innerHTML = `<span class="material-icons">${note.pinned ? 'push_pin' : 'push_pin'}</span>`;
    pinButton.addEventListener('click', (event) => { event.stopPropagation(); togglePinNote(note.id); });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-note-btn', 'material-button-icon');
    deleteButton.title = 'Delete Note';
    deleteButton.innerHTML = '<span class="material-icons">delete_outline</span>';
    deleteButton.addEventListener('click', (event) => { event.stopPropagation(); deleteNote(note.id); });

    actionsDiv.appendChild(pinButton);
    actionsDiv.appendChild(deleteButton);

    card.appendChild(titleDiv); // Add Title
    card.appendChild(contentPreview); // Add content preview
    card.appendChild(actionsDiv); // Add actions div

    card.addEventListener('click', () => openNoteForEditing(note.id));

    return card;
}

// --- TipTap Editor Setup ---
function setupNoteEditor(content = '') {
    if (noteEditorInstance) {
        noteEditorInstance.commands.setContent(content);
        noteEditorInstance.setEditable(true);
        return;
    }
    if (!noteBodyEditorEl) return;
    noteEditorInstance = new Editor({
        element: noteBodyEditorEl,
        extensions: [ StarterKit.configure({ horizontalRule: false, codeBlock: false }) ],
        content: content,
        autofocus: false,
        editable: true,
        onUpdate: ({ editor }) => { if (currentEditingNoteId) handleNoteUpdate(currentEditingNoteId); },
    });
    console.log("Note TipTap Editor Initialized.");
}

function destroyNoteEditor() {
    if (noteEditorInstance) {
        noteEditorInstance.destroy();
        noteEditorInstance = null;
        console.log("Note TipTap Editor Destroyed.");
    }
    if (noteBodyEditorEl) noteBodyEditorEl.innerHTML = '';
}

// --- Core Note Actions ---
function createNewNote() {
    console.log("Creating new note...");
    const newNoteId = generateNoteId();
    const timestamp = Date.now();
    const firstUnpinnedIndex = notes.findIndex(n => !n.pinned);
    const newOrder = (firstUnpinnedIndex === -1) ? notes.length : notes[firstUnpinnedIndex].order;

    notes.forEach(note => { if (note.order >= newOrder) note.order += 1; });

    const newNote = { id: newNoteId, title: '', content: '', pinned: false, order: newOrder, createdAt: timestamp, updatedAt: timestamp };
    notes.push(newNote);
    saveNotes();
    renderNotesList();
    openNoteForEditing(newNoteId);
}

function openNoteForEditing(noteId) {
    const note = findNoteById(noteId);
    if (!note) return;
    console.log(`Opening note ${noteId} for editing...`);
    if (currentEditingNoteId && currentEditingNoteId !== noteId && noteEditorInstance) {
         handleNoteUpdate(currentEditingNoteId, true);
    }
    currentEditingNoteId = noteId;
    setupNoteEditor(note.content || '');
    noteTitleInput.value = note.title;
    noteEditorContainer.style.display = 'flex';
    renderNotesList(); // Update active state
    noteTitleInput.focus();
    noteTitleInput.oninput = () => handleNoteUpdate(noteId);
}

function closeNoteEditor() {
    console.log("Closing note editor...");
    if (currentEditingNoteId) handleNoteUpdate(currentEditingNoteId, true);
    destroyNoteEditor();
    noteEditorContainer.style.display = 'none';
    noteTitleInput.value = '';
    currentEditingNoteId = null;
    renderNotesList();
    noteTitleInput.oninput = null;
}

function deleteNote(noteId) {
    const noteIndex = findNoteIndexById(noteId);
    if (noteIndex === -1) return;
    if (!confirm(`Delete "${notes[noteIndex].title || 'this note'}"?`)) return;
    console.log(`Deleting note ${noteId}...`);
    const wasEditing = currentEditingNoteId === noteId;
    if (wasEditing) { currentEditingNoteId = null; closeNoteEditor(); }

    const deletedOrder = notes[noteIndex].order;
    notes.splice(noteIndex, 1);
    notes.forEach(note => { if (note.order > deletedOrder) note.order -= 1; });
    saveNotes();
    if (!wasEditing) renderNotesList();
}

function togglePinNote(noteId) {
    const note = findNoteById(noteId);
    if (!note) return;
    console.log(`Toggling pin for note ${noteId}...`);
    note.pinned = !note.pinned;
    note.updatedAt = Date.now();
    adjustOrderForPinning(note);
    saveNotes();
    renderNotesList();
}

/** Adjusts note order when pinning/unpinning */
function adjustOrderForPinning(changedNote) {
    notes.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return a.order - b.order;
    });
    notes.forEach((note, index) => note.order = index);
}


/** Handles note updates (debounced). */
function handleNoteUpdate(noteId, immediate = false) {
    const note = findNoteById(noteId);
    if (!note || noteId !== currentEditingNoteId) return;

    const updateAction = () => {
        if (!noteEditorInstance && !noteTitleInput) return;

        const newTitle = noteTitleInput ? noteTitleInput.value : note.title;
        const newContent = noteEditorInstance && noteEditorInstance.isEditable ? noteEditorInstance.getHTML() : note.content;

        let changed = false;
        const cardItem = notesListContainer?.querySelector(`.note-card[data-note-id="${noteId}"]`); // Get the whole card

        if (note.title !== newTitle) {
            note.title = newTitle;
            changed = true;
            // Update title in the list item immediately
            const titleDiv = cardItem?.querySelector('.note-card-title');
            if (titleDiv) titleDiv.textContent = newTitle || 'Untitled Note';
        }
        if (note.content !== newContent) {
            note.content = newContent;
            changed = true;
            // Update content preview in the list item immediately
            const contentPreviewDiv = cardItem?.querySelector('.note-card-content-preview');
            if (contentPreviewDiv) {
                 const plainText = getPlainTextFromHtml(newContent);
                 const previewText = plainText.length > 80 ? plainText.substring(0, 80) + '...' : plainText;
                 contentPreviewDiv.textContent = plainText ? previewText : '';
                 contentPreviewDiv.style.display = plainText ? 'block' : 'none';
            }
        }

        if (changed) {
            note.updatedAt = Date.now();
            console.log(`Auto-saving note ${noteId}...`);
            saveNotes();
        }
    };

    if (saveTimeout) clearTimeout(saveTimeout);
    if (immediate) updateAction();
    else saveTimeout = setTimeout(updateAction, 500);
}

// --- Drag and Drop Logic ---

function handleDragStart(e) {
    const targetCard = e.target.closest('.note-card');
    if (!targetCard) return;
    draggedNoteId = targetCard.dataset.noteId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedNoteId);
    // Add dragging class after a short delay to allow browser to capture snapshot
    setTimeout(() => targetCard.classList.add('dragging'), 0);
    console.log(`Drag Start: ${draggedNoteId}`);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Add visual indicator (e.g., border) to potential drop target
    const targetCard = e.target.closest('.note-card');
    // Remove indicator from previously hovered elements
    document.querySelectorAll('.note-card.drag-over').forEach(el => el.classList.remove('drag-over'));
    if (targetCard && targetCard.dataset.noteId !== draggedNoteId) {
        targetCard.classList.add('drag-over'); // Add class to current hover target
    }
}

// Clear drag-over styles when leaving a potential target
function handleDragLeave(e) {
    const targetCard = e.target.closest('.note-card');
    if (targetCard) {
        targetCard.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    document.querySelectorAll('.note-card.drag-over').forEach(el => el.classList.remove('drag-over')); // Clear indicators
    const droppedOnCard = e.target.closest('.note-card');
    const draggedNote = findNoteById(draggedNoteId);

    if (!draggedNoteId || !draggedNote) return;

    console.log(`Drop: ${draggedNoteId}`);
    document.querySelector('.note-card.dragging')?.classList.remove('dragging');

    let targetOrder = -1;

    if (droppedOnCard) {
        const droppedOnNote = findNoteById(droppedOnCard.dataset.noteId);
        if (droppedOnNote && droppedOnNote.id !== draggedNoteId) {
            targetOrder = droppedOnNote.order;
        } else {
            draggedNoteId = null; return; // Dropped on self or invalid
        }
    } else {
        targetOrder = notes.length; // Append to end if dropped on container
    }

    // --- Update Order Logic ---
    const originalIndex = findNoteIndexById(draggedNoteId);
    if (originalIndex === -1) return;
    const [movedNote] = notes.splice(originalIndex, 1);
    let insertAtIndex = notes.findIndex(note => note.order >= targetOrder);
    if (insertAtIndex === -1) insertAtIndex = notes.length;
    notes.splice(insertAtIndex, 0, movedNote);
    notes.forEach((note, index) => note.order = index); // Re-index
    // --- End Update Order Logic ---

    draggedNoteId = null;
    saveNotes();
    renderNotesList();
}

function handleDragEnd(e) {
    document.querySelector('.note-card.dragging')?.classList.remove('dragging');
    document.querySelectorAll('.note-card.drag-over').forEach(el => el.classList.remove('drag-over')); // Ensure cleanup
    draggedNoteId = null;
     console.log("Drag End");
}


// --- Initialization ---
export function initNotes() {
    console.log("Initializing Notes Feature...");
    if (!notesListContainer || !addNoteBtn || !noteEditorContainer || !noteTitleInput || !noteBodyEditorEl || !closeNoteEditorBtn) {
        console.error("One or more required notes elements not found. Aborting notes initialization.");
        return;
    }

    loadNotes();
    renderNotesList();

    addNoteBtn.addEventListener('click', createNewNote);
    closeNoteEditorBtn.addEventListener('click', closeNoteEditor);

    notesListContainer.addEventListener('dragstart', handleDragStart);
    notesListContainer.addEventListener('dragover', handleDragOver);
    notesListContainer.addEventListener('dragleave', handleDragLeave); // Add leave listener
    notesListContainer.addEventListener('drop', handleDrop);
    notesListContainer.addEventListener('dragend', handleDragEnd);

    console.log("Notes Feature Initialized with Drag & Drop.");
}