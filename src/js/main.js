import { editor } from './editor.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variable for Editor ---
    let editorInstance = null; // Will be initialized later

    // API Key Elements
    const apiKeyInput = document.getElementById('api-key');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const apiKeyStatus = document.getElementById('api-key-status');
    const siteUrlInput = document.getElementById('site-url'); // Keep for API header
    const siteNameInput = document.getElementById('site-name'); // Keep for API header

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const editorContainer = document.querySelector('.editor-container');
    const sidebarElement = document.querySelector('.sidebar'); // Needed?
    
    // Add toolbar reference
    const toolbarElement = document.getElementById('formatting-toolbar');
    const wordCountDisplay = document.getElementById('word-count');

    // AI Tool Buttons & Outputs (Get references for enabling/disabling and listeners)
    const aiToolButtons = [
        'get-continuations-btn', 'use-custom-prompt-btn', 'get-prompts-btn',
        'change-tone-btn', 'show-dont-tell-btn', 'simplify-btn', 'elevate-btn',
        'concise-btn', /*'repetition-btn',*/ 'expand-btn', 'sensory-btn',
        'whatif-btn', /*'brainstorm-btn',*/ 'summarize-btn', 'headline-btn'
    ];
    const aiOutputAreas = [ // Get output areas to clear them if needed
        'continuations-output', 'custom-prompt-output', 'prompts-output',
        'tone-output', 'show-dont-tell-output', 'simplify-output', 'elevate-output',
        'concise-output', /*'repetition-output',*/ 'expand-output', 'sensory-output',
        'whatif-output', /*'brainstorm-output',*/ 'summarize-output', 'headline-output'
    ];

    // --- State ---
    let openRouterApiKey = localStorage.getItem('openRouterApiKey') || null;

    // --- Constants ---
    const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
    let OPENROUTER_MODEL = "google/gemma-2-9b-it:free"; // Try Gemma 2 Free
    const MAX_CONTEXT_WORDS = 500; // Limit context sent to API

    // --- API Key Handling ---
    function setApiKey(key) {
        if (key && key.trim().length > 0) {
            openRouterApiKey = key.trim();
            localStorage.setItem('openRouterApiKey', openRouterApiKey);
            apiKeyStatus.textContent = 'API Key is set.';
            apiKeyStatus.className = 'valid';
            apiKeyInput.value = openRouterApiKey;
            enableApiButtons(true);
        } else {
            openRouterApiKey = null;
            localStorage.removeItem('openRouterApiKey');
            apiKeyStatus.textContent = 'Key not set. Features disabled.';
            apiKeyStatus.className = '';
            apiKeyInput.value = '';
            enableApiButtons(false);
        }
    }

    function enableApiButtons(enabled) {
        aiToolButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = !enabled;
            }
        });
        // Also handle select dropdowns if needed (e.g., tone select)
         const toneSelect = document.getElementById('tone-select');
         if (toneSelect) toneSelect.disabled = !enabled;
    }

    // --- Initialize TipTap Editor ---
    function initializeEditor() {
        try {
            editorInstance = editor;
            if (!editorInstance) {
                console.error('Editor failed to initialize');
                return;
            }
            
            window.editor = editorInstance; // Make accessible globally if needed

            // Listen for updates to keep toolbar and word count current
            editorInstance.on('update', () => {
                updateToolbarActiveState();
                updateWordCount();
            });

            setupToolbarListeners();
            updateToolbarActiveState(); // Set initial active states
            updateWordCount(); // Set initial word count
        } catch (error) {
            console.error('Error initializing editor:', error);
        }
    }

    // --- Word Count ---
    function updateWordCount() {
        if (!editorInstance || !editorInstance.storage.characterCount) {
            wordCountDisplay.textContent = '0 words';
            return;
        }
        const count = editorInstance.storage.characterCount.words();
        wordCountDisplay.textContent = `${count} words`;
    }

    // --- Formatting Toolbar Logic ---
    function setupToolbarListeners() {
        if (!toolbarElement) return;

        toolbarElement.addEventListener('click', (e) => {
            const button = e.target.closest('button.toolbar-button');
            if (!button || !editorInstance) return;

            const command = button.dataset.command;
            const level = button.dataset.level ? parseInt(button.dataset.level, 10) : null;
            const value = button.dataset.value; // For alignment

            let commandChain = editorInstance.chain().focus(); // Always refocus

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
        });
    }

    function updateToolbarActiveState() {
        if (!toolbarElement || !editorInstance) return;

        document.querySelectorAll('#formatting-toolbar button[data-command]').forEach(button => {
            const command = button.dataset.command;
            let isActive = false;

            switch (command) {
                case 'toggleBold':          isActive = editorInstance.isActive('bold'); break;
                case 'toggleItalic':        isActive = editorInstance.isActive('italic'); break;
                case 'toggleUnderline':     isActive = editorInstance.isActive('underline'); break;
                case 'toggleStrike':        isActive = editorInstance.isActive('strike'); break;
                case 'toggleBulletList':    isActive = editorInstance.isActive('bulletList'); break;
                case 'toggleOrderedList':   isActive = editorInstance.isActive('orderedList'); break;
                case 'toggleBlockquote':    isActive = editorInstance.isActive('blockquote'); break;
                case 'toggleCodeBlock':     isActive = editorInstance.isActive('codeBlock'); break;
                case 'setParagraph':        isActive = editorInstance.isActive('paragraph'); break;
                case 'toggleHeading':
                    const level = button.dataset.level ? parseInt(button.dataset.level, 10) : null;
                    if (level) isActive = editorInstance.isActive('heading', { level: level });
                    break;
                case 'setTextAlign':
                    const value = button.dataset.value;
                    if (value) isActive = editorInstance.isActive({ textAlign: value });
                    break;
                case 'undo':
                    button.disabled = !editorInstance.can().undo(); // Handle disable/enable
                    return; // Skip active class toggle
                case 'redo':
                    button.disabled = !editorInstance.can().redo(); // Handle disable/enable
                    return; // Skip active class toggle
                default: break;
            }

            if (isActive) {
                button.classList.add('is-active');
            } else {
                button.classList.remove('is-active');
            }

            const undoBtn = document.querySelector('button[data-command="undo"]');
            const redoBtn = document.querySelector('button[data-command="redo"]');
            if (undoBtn) undoBtn.disabled = !editorInstance.can().undo();
            if (redoBtn) redoBtn.disabled = !editorInstance.can().redo();
        });
    }

    // --- Core AI Interaction Function ---
    async function fetchAIResponse(promptType, context = '', customInstruction = '') {
        if (!openRouterApiKey) {
            console.error("OpenRouter API Key is not set.");
            return { error: "API Key not set." };
        }

        console.log(`fetchAIResponse called with context: "${context.substring(0, 100)}..."`);

        let userPrompt = "";
        const truncatedContext = context.split(/\s+/).slice(-MAX_CONTEXT_WORDS).join(' ');
        console.log(`Truncated context for prompt: "${truncatedContext.substring(0, 100)}..."`);

        switch (promptType) {
            // --- Text Generation ---
            case 'get_continuations':
                userPrompt = `Continue the following text seamlessly, maintaining the existing tone and style. Provide only the continued text, without any introduction or explanation.\n\nTEXT:\n"${truncatedContext}"\n\nCONTINUATION:`;
                break;
            case 'custom': // User provides the full instruction
                userPrompt = `Follow this instruction precisely for the given text. Provide only the resulting text, without any introduction or explanation.\n\nINSTRUCTION:\n${customInstruction}\n\nTEXT:\n"${truncatedContext}"\n\nRESULT:`;
                break;
            case 'get_prompts':
                userPrompt = `Suggest 3 distinct writing prompts based on the following text. Each prompt should be on a new line. Provide only the prompts, without any numbering, introduction, or explanation.\n\nTEXT:\n"${truncatedContext}"\n\nPROMPTS:`;
                break;

            // --- Refinement & Style ---
            case 'changeTone':
                // Example embedded in the customInstruction from the calling function
                userPrompt = `Rewrite the following text in the specified tone. Provide *only* the rewritten text, without any introduction or explanation.\n\n${customInstruction}\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
                // Example customInstruction: "Rewrite this text in a Formal tone. Example Input: 'The guy left.' Example Output: 'The gentleman departed.'"
                break;
            case 'showDontTell':
                userPrompt = `Rewrite the following text to "show" the action or emotion, not "tell" it, using vivid descriptions and actions. Provide *only* the rewritten text.\n\nExample Input: 'She was happy.'\nExample Output: 'A wide smile spread across her face as she skipped down the path.'\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
                break;
            case 'simplify':
                userPrompt = `Rewrite the following text using simpler words and shorter sentences for easier understanding, while preserving the original meaning. Provide *only* the rewritten text.\n\nExample Input: 'The meteorological conditions precipitated an inundation.'\nExample Output: 'The weather caused a flood.'\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
                break;
            case 'elevate':
                userPrompt = `Elevate the phrasing of the following text using more sophisticated, evocative, and precise language, without changing the core meaning. Provide *only* the rewritten text.\n\nExample Input: 'The food was good.'\nExample Output: 'The culinary preparation was exquisite.'\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
                break;
            case 'concise':
                userPrompt = `Rewrite the following text to be more concise, removing redundant words/phrases while preserving the essential meaning. Provide *only* the rewritten text.\n\nExample Input: 'Due to the fact that it was raining, we decided to cancel the picnic.'\nExample Output: 'Because it was raining, we cancelled the picnic.'\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
                break;

            // --- Idea Generation ---
            case 'expand':
                userPrompt = `Expand on the following idea or text, adding more detail, explanation, or related concepts. Provide only the expanded text, integrating naturally if possible.\n\nTEXT TO EXPAND:\n"${truncatedContext}"\n\nEXPANDED TEXT:`;
                break;
            case 'sensory':
                userPrompt = `Enhance the following text by adding relevant sensory details (sight, sound, smell, taste, touch) to make it more immersive. Provide *only* the rewritten text with added details.\n\nTEXT TO ENHANCE:\n"${truncatedContext}"\n\nENHANCED TEXT:`;
                break;
            case 'whatIf':
                userPrompt = `Suggest 3 intriguing "What if?" scenarios or plot twists based on the following text. Each scenario should be on a new line. Provide only the scenarios, without any numbering, introduction, or explanation.\n\nTEXT:\n"${truncatedContext}"\n\nWHAT IF SCENARIOS:`;
                break;

            // --- Analysis & Structure ---
            case 'summarize':
                userPrompt = `Provide a brief, concise summary (1-2 sentences) of the key points or main idea of the following text. Output *only* the summary sentence(s).\n\nTEXT TO SUMMARIZE:\n"${truncatedContext}"\n\nSUMMARY:`;
                break;
            case 'headline':
                userPrompt = `Suggest 3-5 compelling titles or headlines suitable for the following text. List each headline on a new line. Provide only the headlines, without any numbering, introduction, or explanation.\n\nTEXT:\n"${truncatedContext}"\n\nHEADLINES:`;
                break;

            default:
                console.error("Unknown prompt type for fetchAIResponse:", promptType);
                return { error: "Invalid request type." };
        }

        console.log(`Final userPrompt being sent: "${userPrompt}"`);

        const messages = [ { "role": "user", "content": userPrompt } ];
        const requestBody = {
            "model": OPENROUTER_MODEL,
            "messages": messages,
            "max_tokens": 200,
            "temperature": 0.7
        };

        console.log("Sending request body to OpenRouter:", JSON.stringify(requestBody, null, 2));

        try {
            const response = await fetch(OPENROUTER_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterApiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": siteUrlInput.value || window.location.href,
                    "X-Title": siteNameInput.value || document.title,
                },
                body: JSON.stringify(requestBody)
            });

            console.log("API Response Status:", response.status, response.statusText);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Unknown API error" }));
                console.error("API Error Response Body:", errorData);
                return { error: `API Error (${response.status}): ${errorData.error?.message || errorData.detail || 'Unknown error'}` };
            }

            const data = await response.json();
            console.log("Raw API Response Data:", JSON.stringify(data, null, 2));

            const choice = data.choices?.[0];
            const message = choice?.message;
            const content = message?.content;
            console.log("Parsed Content:", content);

            if (content !== undefined && content !== null) {
                 if (content.trim().length === 0) {
                     console.warn("API returned only whitespace.");
                     return { error: "API returned only whitespace." };
                 }
                 const results = content.split('\n')
                                        .map(line => line.trim())
                                        .filter(line => line.length > 0);
                 console.log("Processed Results:", results);
                 if (results.length === 0) {
                     console.warn("Splitting/filtering resulted in empty array, returning raw content as single item.");
                     return { results: [content.trim()] };
                 }
                 return { results: results };
            } else {
                 console.error("API response structure issue: 'content' field is missing or null.", data);
                 const finishReason = choice?.finish_reason;
                 console.log("Finish Reason:", finishReason);
                 if (finishReason === 'length') return { error: "API response cut short (max_tokens reached?)." };
                 if (finishReason === 'content_filter') return { error: "API response blocked by content filter." };
                 return { error: "API returned an empty or unexpected response structure." };
            }
        } catch (error) {
            console.error("Fetch Error:", error);
             return { error: "Network error or failed to fetch." };
        }
    }

    // --- Display AI Results ---
    function displayResults(outputElement, resultData, selectionInfo = null) {
        outputElement.innerHTML = '';
        if (!editorInstance) return;

        if (resultData.error) {
            outputElement.innerHTML = `<i>Error: ${resultData.error}</i>`;
            if (resultData.error === "API returned only whitespace.") {
                 outputElement.innerHTML = `<i>Model did not provide a suggestion. (Try different text or model?)</i>`;
             }
        } else if (resultData.results && resultData.results.length > 0) {
            resultData.results.forEach(resultText => {
                const div = document.createElement('div');
                const cleanResultText = resultText.replace(/^(Continue this text:|Suggest writing prompts based on this text:|Rewrite this text.*?:|.*?:\n")/, '').trim();

                if (cleanResultText.length === 0) return;

                div.textContent = cleanResultText;
                div.addEventListener('click', () => {
                    let commandChain = editorInstance.chain().focus();

                    if (selectionInfo && !selectionInfo.isEmpty) {
                        commandChain.insertContentAt({ from: selectionInfo.from, to: selectionInfo.to }, cleanResultText);
                         commandChain.setTextSelection(selectionInfo.from + cleanResultText.length);
                    } else {
                        const insertPos = editorInstance.state.selection.to;
                        commandChain.insertContentAt(insertPos, ' ' + cleanResultText);
                        commandChain.setTextSelection(insertPos + cleanResultText.length + 1);
                    }

                    commandChain.run();

                    updateWordCount();
                    outputElement.innerHTML = '';
                });
                outputElement.appendChild(div);
            });
             if (outputElement.childElementCount === 0) {
                outputElement.innerHTML = '<i>Model response filtered, no usable suggestions found.</i>';
            }
        } else {
            outputElement.innerHTML = '<i>No suggestions found.</i>';
        }
    }

    // --- Event Listeners for AI Buttons (Main Handler) ---
    async function handleApiButtonClick(button, outputElement, promptType, requiresSelection = false, getCustomInstruction = null) {
         if (!editorInstance || button.disabled) return;

         let currentText = '';
         let selectedText = '';
         let selectionInfo = {
             from: editorInstance.state.selection.from,
             to: editorInstance.state.selection.to,
             isEmpty: editorInstance.state.selection.empty
         };

         if (requiresSelection) {
             if (selectionInfo.isEmpty) {
                 outputElement.innerHTML = `<i>Please select some text in the editor first.</i>`;
                 return;
             }
             selectedText = editorInstance.state.doc.textBetween(selectionInfo.from, selectionInfo.to, ' ');
             console.log(`handleApiButtonClick (${promptType}): Selected text: "${selectedText.substring(0,100)}..."`);
             currentText = selectedText;
         } else {
             currentText = editorInstance.getText();
             console.log(`handleApiButtonClick (${promptType}): Full text read from editor: "${currentText.substring(0,100)}..."`);
             const needsAnyContext = ['get_continuations', 'get_prompts', 'headline', 'whatIf'].includes(promptType);
             if (needsAnyContext && currentText.trim().length === 0) {
                  outputElement.innerHTML = `<i>Please enter some text in the editor first.</i>`;
                  console.log(`API call blocked for ${promptType}: Text area is empty.`);
                  return;
             }
         }

        let customInstruction = '';
        if (typeof getCustomInstruction === 'function') {
            customInstruction = getCustomInstruction();
            if (!customInstruction) {
                outputElement.innerHTML = '<i>Missing instruction for this tool.</i>';
                return;
            }
        }

         const originalContent = button.innerHTML;
         button.disabled = true;
         button.innerHTML = '<span class="material-icons spin">sync</span> Loading...';
         outputElement.innerHTML = '<i>Generating...</i>';

         const resultData = await fetchAIResponse(promptType, currentText, customInstruction);

         displayResults(outputElement, resultData, requiresSelection ? selectionInfo : null);

         button.innerHTML = originalContent;
         if (openRouterApiKey) {
            button.disabled = false;
         }
    }

    // --- Attach Listeners to AI Tool Buttons ---

    function getElement(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`Element with ID "${id}" not found.`);
        return el;
    }

    getElement('get-continuations-btn')?.addEventListener('click', () => {
        handleApiButtonClick(getElement('get-continuations-btn'), getElement('continuations-output'), 'get_continuations');
    });
    getElement('use-custom-prompt-btn')?.addEventListener('click', () => {
        const customPromptInput = getElement('custom-prompt');
        handleApiButtonClick(
            getElement('use-custom-prompt-btn'),
            getElement('custom-prompt-output'),
            'custom',
            false,
            () => {
                 const text = customPromptInput ? customPromptInput.value.trim() : '';
                 if (!text) getElement('custom-prompt-output').innerHTML = '<i>Please enter a custom prompt.</i>';
                 return text;
            }
        );
    });
    getElement('get-prompts-btn')?.addEventListener('click', () => {
        handleApiButtonClick(getElement('get-prompts-btn'), getElement('prompts-output'), 'get_prompts');
    });

    getElement('change-tone-btn')?.addEventListener('click', () => {
        const toneSelect = getElement('tone-select');
        handleApiButtonClick(
            getElement('change-tone-btn'),
            getElement('tone-output'),
            'changeTone',
            true,
            () => `Rewrite this text in a ${toneSelect ? toneSelect.value : 'default'} tone`
        );
    });

    function addSelectionToolListener(buttonId, outputId, promptType, instruction) {
         getElement(buttonId)?.addEventListener('click', () => {
            handleApiButtonClick(getElement(buttonId), getElement(outputId), promptType, true, () => instruction);
        });
    }

    addSelectionToolListener('show-dont-tell-btn', 'show-dont-tell-output', 'showDontTell', 'Rewrite this to show, not tell');
    addSelectionToolListener('simplify-btn', 'simplify-output', 'simplify', 'Rewrite this using simpler language');
    addSelectionToolListener('elevate-btn', 'elevate-output', 'elevate', 'Rewrite this with more sophisticated, evocative language');
    addSelectionToolListener('concise-btn', 'concise-output', 'concise', 'Rewrite this to be more concise without losing meaning');

    addSelectionToolListener('expand-btn', 'expand-output', 'expand', 'Expand on this idea');
    addSelectionToolListener('sensory-btn', 'sensory-output', 'sensory', 'Suggest sensory details to enrich this description');
    getElement('whatif-btn')?.addEventListener('click', () => {
        handleApiButtonClick(getElement('whatif-btn'), getElement('whatif-output'), 'whatIf', false, () => 'Suggest "What if?" plot twists or alternatives based on this');
    });

    addSelectionToolListener('summarize-btn', 'summarize-output', 'summarize', 'Summarize this text concisely');
    getElement('headline-btn')?.addEventListener('click', () => {
         handleApiButtonClick(getElement('headline-btn'), getElement('headline-output'), 'headline', false, () => 'Suggest several titles or headlines for this text');
    });

    if (sidebarToggle && editorContainer) {
        sidebarToggle.addEventListener('click', () => {
            editorContainer.classList.toggle('collapsed-sidebar');
            const icon = sidebarToggle.querySelector('.material-icons');
            if (icon) {
                 icon.textContent = editorContainer.classList.contains('collapsed-sidebar') ? 'chevron_left' : 'chevron_right';
                 icon.style.transform = editorContainer.classList.contains('collapsed-sidebar') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
         const icon = sidebarToggle.querySelector('.material-icons');
         if (icon) {
             icon.textContent = editorContainer.classList.contains('collapsed-sidebar') ? 'chevron_left' : 'chevron_right';
             icon.style.transform = editorContainer.classList.contains('collapsed-sidebar') ? 'rotate(0deg)' : 'rotate(180deg)';
         }
    } else {
        console.warn("Sidebar toggle button or editor container not found.");
    }

     getElement('visualize-btn')?.addEventListener('click', () => { alert('Visualize feature clicked (implementation needed)'); });
     getElement('share-btn')?.addEventListener('click', () => {
        if (!editorInstance) return;
        const content = editorInstance.getText();

        const format = prompt('Export as (type "txt" or "md"):', 'txt');
        if (!format) return;

        let mimeType = 'text/plain';
        let extension = 'txt';

        if (format.toLowerCase() === 'md') {
            mimeType = 'text/markdown';
            extension = 'md';
        } else if (format.toLowerCase() !== 'txt') {
            alert('Unsupported format. Please enter "txt" or "md".');
            return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `document.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    getElement('reset-btn')?.addEventListener('click', () => {
        if (confirm('Start over? This will clear the editor content.')) {
            if(editorInstance) editorInstance.commands.clearContent(true);
            updateWordCount();
            aiOutputAreas.forEach(id => {
                 const area = getElement(id);
                 if(area) area.innerHTML = '';
            });
            getElement('custom-prompt').value = '';
        }
    });

    initializeEditor();
    setApiKey(openRouterApiKey);
});
