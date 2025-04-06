// uiHandlers.js - Manages UI interactions, event listeners, and result display

import { fetchAIResponse, setApiKey, getApiKey } from './apiClient.js';
// We will receive the editor instance from main.js after initialization

let editorInstance = null; // To be set by initializeUIHandlers

// Store references to frequently used elements
const uiElements = {
    apiKeyInput: null,
    saveApiKeyBtn: null,
    apiKeyStatus: null,
    sidebarToggle: null,
    editorContainer: null,
    aiToolButtons: [],
    aiOutputAreas: {}, // Map button ID to output area ID
    toneSelect: null,
    customPromptInput: null,
    resetBtn: null,
    shareBtn: null,
    // Sidebar Tabs
    sidebarTabsContainer: null,
    sidebarTabs: [],
    sidebarPanels: [],
};

// IDs of AI tool buttons and their corresponding output areas
const aiToolConfig = {
    'get-continuations-btn': { outputId: 'continuations-output', requiresSelection: false },
    'use-custom-prompt-btn': { outputId: 'custom-prompt-output', requiresSelection: false, customInstruction: true },
    'get-prompts-btn': { outputId: 'prompts-output', requiresSelection: false },
    'change-tone-btn': { outputId: 'tone-output', requiresSelection: true, customInstruction: true },
    'show-dont-tell-btn': { outputId: 'show-dont-tell-output', requiresSelection: true },
    'simplify-btn': { outputId: 'simplify-output', requiresSelection: true },
    'elevate-btn': { outputId: 'elevate-output', requiresSelection: true },
    'concise-btn': { outputId: 'concise-output', requiresSelection: true },
    'expand-btn': { outputId: 'expand-output', requiresSelection: true },
    'sensory-btn': { outputId: 'sensory-output', requiresSelection: true },
    'whatif-btn': { outputId: 'whatif-output', requiresSelection: false },
    'summarize-btn': { outputId: 'summarize-output', requiresSelection: true },
    'headline-btn': { outputId: 'headline-output', requiresSelection: false },
};

/**
 * Helper function to get and store element references.
 * @param {string} id - The element ID.
 * @returns {HTMLElement|null} The found element or null.
 */
function getElement(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`Element with ID "${id}" not found.`);
    return el;
}

/**
 * Displays results (or errors) from the AI API in the specified output area.
 * @param {HTMLElement} outputElement - The DOM element to display results in.
 * @param {{results?: string[], error?: string}} resultData - The data from fetchAIResponse.
 * @param {{from: number, to: number, isEmpty: boolean}|null} selectionInfo - Info about the text selection when the request was made.
 */
function displayResults(outputElement, resultData, selectionInfo = null) {
    outputElement.innerHTML = ''; // Clear previous results
    if (!editorInstance) return;

    if (resultData.error) {
        let errorMessage = resultData.error;
         if (errorMessage === "API returned only whitespace.") {
             errorMessage = "Model did not provide a suggestion. (Try different text or model?)";
         } else if (errorMessage.includes("Invalid API Key")) {
             errorMessage += " Please check your key in the sidebar.";
         } else if (errorMessage.includes("Rate limit exceeded")) {
             errorMessage += " Please try again later or check your OpenRouter plan.";
         }
        outputElement.innerHTML = `<i class="error-message">Error: ${errorMessage}</i>`;
    } else if (resultData.results && resultData.results.length > 0) {
        resultData.results.forEach(resultText => {
            const div = document.createElement('div');
            // Basic cleaning - remove potential instruction prefixes left by the model
            const cleanResultText = resultText.replace(/^(Continue this text:|Suggest writing prompts based on this text:|Rewrite this text.*?:|.*?:\n")/, '').trim();

            if (cleanResultText.length === 0) return; // Skip empty results after cleaning

            div.textContent = cleanResultText;
            div.title = "Click to insert/replace"; // Add tooltip
            div.addEventListener('click', () => {
                let commandChain = editorInstance.chain().focus();

                // If there was a selection, replace it. Otherwise, insert at the cursor.
                if (selectionInfo && !selectionInfo.isEmpty) {
                    commandChain.insertContentAt({ from: selectionInfo.from, to: selectionInfo.to }, cleanResultText);
                    // Set cursor at the end of the inserted content
                    commandChain.setTextSelection(selectionInfo.from + cleanResultText.length);
                } else {
                    const insertPos = editorInstance.state.selection.to;
                    // Insert with a leading space if inserting mid-text, unless at the start of doc
                    const prefix = (insertPos > 0 && editorInstance.state.doc.textBetween(insertPos - 1, insertPos) !== ' ') ? ' ' : '';
                    commandChain.insertContentAt(insertPos, prefix + cleanResultText);
                    // Set cursor at the end of the inserted content
                    commandChain.setTextSelection(insertPos + prefix.length + cleanResultText.length);
                }

                commandChain.run();

                // Clear the output area after insertion
                outputElement.innerHTML = '';
            });
            outputElement.appendChild(div);
        });
         // Handle case where filtering leaves no results
         if (outputElement.childElementCount === 0) {
            outputElement.innerHTML = '<i>Model response filtered, no usable suggestions found.</i>';
        }
    } else {
        outputElement.innerHTML = '<i>No suggestions found.</i>';
    }
}

/**
 * Generic handler for AI tool button clicks.
 * @param {Event} event - The click event.
 */
async function handleApiButtonClick(event) {
    const button = event.currentTarget; // The button the listener is attached to
    const buttonId = button.id;
    const config = aiToolConfig[buttonId];

    if (!editorInstance || button.disabled || !config) return;

    const outputElement = getElement(config.outputId);
    if (!outputElement) {
        console.error(`Output element #${config.outputId} not found for button #${buttonId}`);
        return;
    }

    let currentText = '';
    let selectionInfo = {
        from: editorInstance.state.selection.from,
        to: editorInstance.state.selection.to,
        isEmpty: editorInstance.state.selection.empty
    };

    // Check if selection is required and if it exists
    if (config.requiresSelection) {
        if (selectionInfo.isEmpty) {
            outputElement.innerHTML = `<i class="error-message">Please select some text in the editor first.</i>`;
            return;
        }
        currentText = editorInstance.state.doc.textBetween(selectionInfo.from, selectionInfo.to, ' ');
        console.log(`handleApiButtonClick (${buttonId}): Selected text: "${currentText.substring(0, 50)}..."`);
    } else {
        // Use full editor text if selection is not required
        currentText = editorInstance.getText();
         console.log(`handleApiButtonClick (${buttonId}): Full text: "${currentText.substring(0, 50)}..."`);
        // Check if text is needed at all for this prompt type
        const needsAnyContext = ['get_continuations', 'get_prompts', 'headline', 'whatIf', 'custom'].includes(buttonId.replace('-btn', ''));
        if (needsAnyContext && currentText.trim().length === 0) {
             outputElement.innerHTML = `<i class="error-message">Please enter some text in the editor first.</i>`;
             console.log(`API call blocked for ${buttonId}: Text area is empty.`);
             return;
        }
    }

    let customInstruction = '';
    if (config.customInstruction) {
        if (buttonId === 'use-custom-prompt-btn') {
            customInstruction = uiElements.customPromptInput ? uiElements.customPromptInput.value.trim() : '';
            if (!customInstruction) {
                outputElement.innerHTML = '<i class="error-message">Please enter a custom prompt instruction.</i>';
                return;
            }
        } else if (buttonId === 'change-tone-btn') {
            const selectedTone = uiElements.toneSelect ? uiElements.toneSelect.value : 'default';
            customInstruction = `Rewrite this text in a ${selectedTone} tone`;
            if (!selectedTone) {
                 outputElement.innerHTML = '<i class="error-message">Please select a tone.</i>';
                 return;
            }
        }
        // Add other custom instruction logic here if needed
    }

    // --- UI Feedback: Loading State ---
    const originalContent = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="material-icons spin">sync</span> Loading...';
    outputElement.innerHTML = '<i>Generating...</i>';
    // ---

    const promptType = buttonId.replace('-btn', ''); // e.g., 'get-continuations-btn' -> 'get-continuations'
    const resultData = await fetchAIResponse(promptType, currentText, customInstruction);

    // --- UI Feedback: Restore Button ---
    button.innerHTML = originalContent;
     // Only re-enable if API key is still valid
    if (getApiKey()) {
        button.disabled = false;
    }
    // ---

    displayResults(outputElement, resultData, config.requiresSelection ? selectionInfo : null);
}

/**
 * Enables or disables all AI tool buttons and related inputs.
 * @param {boolean} enabled - Whether to enable or disable the buttons.
 */
function enableApiControls(enabled) {
    uiElements.aiToolButtons.forEach(btn => {
        if (btn) btn.disabled = !enabled;
    });
    if (uiElements.toneSelect) uiElements.toneSelect.disabled = !enabled;
    if (uiElements.customPromptInput) uiElements.customPromptInput.disabled = !enabled; // Also disable input
    // Note: Save button for API key should always be enabled
}

/**
 * Sets up the handler for saving the API key.
 */
function setupApiKeyHandler() {
    if (!uiElements.apiKeyInput || !uiElements.saveApiKeyBtn || !uiElements.apiKeyStatus) return;

    // Set initial state based on stored key
    const currentKey = getApiKey();
    if (currentKey) {
        uiElements.apiKeyInput.value = currentKey;
        uiElements.apiKeyStatus.textContent = 'API Key is set.';
        uiElements.apiKeyStatus.className = 'valid';
        enableApiControls(true);
    } else {
        uiElements.apiKeyStatus.textContent = 'Key not set. Features disabled.';
        uiElements.apiKeyStatus.className = '';
        enableApiControls(false);
    }

    uiElements.saveApiKeyBtn.addEventListener('click', () => {
        const newKey = uiElements.apiKeyInput.value;
        setApiKey(newKey); // Update key in apiClient and localStorage
        if (getApiKey()) {
            uiElements.apiKeyStatus.textContent = 'API Key saved.';
            uiElements.apiKeyStatus.className = 'valid';
            enableApiControls(true);
        } else {
            uiElements.apiKeyStatus.textContent = 'Key not set. Features disabled.';
            uiElements.apiKeyStatus.className = '';
            enableApiControls(false);
        }
    });
}

/**
 * Sets up the handler for the sidebar toggle button.
 */
function setupSidebarToggle() {
    if (!uiElements.sidebarToggle || !uiElements.editorContainer) return;

    // Set initial icon based on state (assuming default is expanded)
    const icon = uiElements.sidebarToggle.querySelector('.material-icons');
    function updateToggleIcon() {
        if (icon) {
            const isCollapsed = uiElements.editorContainer.classList.contains('collapsed-sidebar');
            icon.textContent = isCollapsed ? 'chevron_left' : 'chevron_right'; // Use correct icons
            icon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(0deg)'; // No rotation needed if icons change
        }
    }

    uiElements.sidebarToggle.addEventListener('click', () => {
        uiElements.editorContainer.classList.toggle('collapsed-sidebar');
        updateToggleIcon(); // Update icon after toggling
    });

    updateToggleIcon(); // Set initial icon state
}

/**
 * Sets up handlers for the footer buttons (Share, Reset).
 */
function setupFooterButtons() {
    // Reset Button
    if (uiElements.resetBtn) {
        uiElements.resetBtn.addEventListener('click', () => {
            if (confirm('Start over? This will clear the editor content and AI outputs.')) {
                if (editorInstance) editorInstance.commands.clearContent(true);
                // Clear all output areas
                Object.values(uiElements.aiOutputAreas).forEach(id => {
                    const area = getElement(id);
                    if (area) area.innerHTML = '';
                });
                // Clear custom prompt input
                if (uiElements.customPromptInput) uiElements.customPromptInput.value = '';
            }
        });
    }

    // Share/Export Button
    if (uiElements.shareBtn) {
        uiElements.shareBtn.addEventListener('click', () => {
            if (!editorInstance) return;
            const content = editorInstance.getText(); // Get plain text content

            const format = prompt('Export as (type "txt" or "md"):', 'txt');
            if (!format) return; // User cancelled

            let mimeType = 'text/plain';
            let extension = 'txt';
            let fileContent = content;

            if (format.toLowerCase() === 'md') {
                // For Markdown, get HTML and convert (basic conversion for now)
                // A proper library like Turndown would be better for complex HTML
                fileContent = editorInstance.getHTML()
                                .replace(/<p>(.*?)<\/p>/g, '$1\n\n') // Basic paragraph to newline
                                .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
                                .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
                                .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
                                .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
                                .replace(/<em>(.*?)<\/em>/g, '*$1*')
                                .replace(/<u>(.*?)<\/u>/g, '$1') // MD doesn't have underline
                                .replace(/<s>(.*?)<\/s>/g, '~~$1~~')
                                .replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1\n\n') // Basic blockquote
                                .replace(/<li>(.*?)<\/li>/g, '* $1\n') // Basic list item
                                .replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```\n\n') // Code blocks
                                .replace(/<code>(.*?)<\/code>/g, '`$1`') // Inline code
                                .replace(/<br\s*\/?>/g, '\n'); // Line breaks

                mimeType = 'text/markdown';
                extension = 'md';
            } else if (format.toLowerCase() !== 'txt') {
                alert('Unsupported format. Please enter "txt" or "md".');
                return;
            }

            const blob = new Blob([fileContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `magic-text-document.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}


/**
 * Initializes all UI handlers and attaches event listeners.
 * Must be called after the DOM is ready and the editor is initialized.
 * @param {Editor} currentEditorInstance - The initialized TipTap editor instance.
 */
export function initializeUIHandlers(currentEditorInstance) {
    if (!currentEditorInstance) {
        console.error("UI Handlers cannot be initialized without an editor instance.");
        return;
    }
    editorInstance = currentEditorInstance; // Store editor instance locally

    // Get references to all UI elements
    uiElements.apiKeyInput = getElement('api-key');
    uiElements.saveApiKeyBtn = getElement('save-api-key-btn');
    uiElements.apiKeyStatus = getElement('api-key-status');
    uiElements.sidebarToggle = getElement('sidebar-toggle');
    uiElements.editorContainer = document.querySelector('.editor-container'); // Use querySelector for class
    uiElements.toneSelect = getElement('tone-select');
    uiElements.customPromptInput = getElement('custom-prompt');
    uiElements.resetBtn = getElement('reset-btn');
    uiElements.shareBtn = getElement('share-btn');

    // Get AI buttons and map output areas
    uiElements.aiToolButtons = Object.keys(aiToolConfig).map(id => getElement(id)).filter(Boolean); // Filter out nulls if elements don't exist
    Object.keys(aiToolConfig).forEach(buttonId => {
        uiElements.aiOutputAreas[buttonId] = aiToolConfig[buttonId].outputId;
    });

    // Setup handlers
    setupApiKeyHandler();
    setupSidebarToggle();
    setupFooterButtons();

    // Attach listeners to AI tool buttons
    uiElements.aiToolButtons.forEach(button => {
        button.addEventListener('click', handleApiButtonClick);
    });

    // Setup Sidebar Tabs
    setupSidebarTabs();

    console.log("UI Handlers Initialized.");
}

/**
 * Sets up the handler for switching between sidebar tabs.
 */
function setupSidebarTabs() {
    uiElements.sidebarTabsContainer = document.querySelector('.sidebar-tabs');
    if (!uiElements.sidebarTabsContainer) {
        console.warn("Sidebar tabs container (.sidebar-tabs) not found.");
        return;
    }

    uiElements.sidebarTabs = Array.from(uiElements.sidebarTabsContainer.querySelectorAll('.sidebar-tab'));
    uiElements.sidebarPanels = Array.from(document.querySelectorAll('.sidebar-panel')); // Get all panels

    uiElements.sidebarTabsContainer.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('.sidebar-tab');
        if (!clickedTab || clickedTab.classList.contains('active')) {
            return; // Click wasn't on a tab or it's already active
        }

        const targetPanelId = clickedTab.dataset.tab; // Get the target panel ID from data-tab attribute

        // Remove active class from all tabs and panels
        uiElements.sidebarTabs.forEach(tab => tab.classList.remove('active'));
        uiElements.sidebarPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to the clicked tab
        clickedTab.classList.add('active');

        // Add active class to the corresponding panel
        const targetPanel = getElement(targetPanelId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        } else {
            console.warn(`Sidebar panel with ID "${targetPanelId}" not found.`);
        }
    });

    // Ensure initial state is correct (first tab/panel should have 'active' class in HTML)
    console.log("Sidebar tabs handler initialized.");
}
