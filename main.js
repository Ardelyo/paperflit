// main.js - Main application entry point

import { initializeEditor } from './editorSetup.js';
import { initializeUIHandlers } from './uiHandlers.js';
import { initNotes } from './notesManager.js'; // Import the notes initializer
import { initializeSiteContext } from './apiClient.js';

// Tab Switching Logic
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate selected tab
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing application...");

    // Initialize context needed for API calls (reads hidden inputs)
    initializeSiteContext('site-url', 'site-name');

    // Initialize the TipTap editor
    const editorInstance = initializeEditor(
        'editor-content',
        'formatting-toolbar',
        'word-count'
    );

    // If editor initialization is successful, initialize UI handlers
    if (editorInstance) {
        initializeUIHandlers(editorInstance);
        console.log("Application initialization complete.");
    } else {
        console.error("Application initialization failed: Editor could not be created.");
        // Optionally display an error message to the user on the page
        const body = document.querySelector('body');
        if (body) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = "Error: Failed to load the text editor. Please refresh the page or contact support.";
            errorDiv.style.color = 'red';
            errorDiv.style.padding = '20px';
            errorDiv.style.textAlign = 'center';
            body.prepend(errorDiv); // Add error message at the top
        }
    }

    // Initialize tab switching
    setupTabSwitching();

    // Initialize the Notes Feature
    initNotes();

});
