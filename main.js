// main.js - Main application entry point

import { initializeEditor } from './editorSetup.js';
import { initializeUIHandlers } from './uiHandlers.js';
import { initializeSiteContext } from './apiClient.js';

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
});
