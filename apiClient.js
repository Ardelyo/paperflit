// apiClient.js - Handles OpenRouter API key management and communication

import {
    OPENROUTER_API_URL,
    DEFAULT_MODEL,
    MAX_CONTEXT_WORDS,
    API_KEY_STORAGE_KEY
} from './config.js';

let openRouterApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || null;
let siteUrl = ''; // Will be read from DOM on init or passed
let siteName = ''; // Will be read from DOM on init or passed

/**
 * Sets the OpenRouter API key, stores it in localStorage, and updates the module state.
 * @param {string} key - The API key.
 */
export function setApiKey(key) {
    if (key && key.trim().length > 0) {
        openRouterApiKey = key.trim();
        localStorage.setItem(API_KEY_STORAGE_KEY, openRouterApiKey);
        console.log("API Key set and stored.");
    } else {
        openRouterApiKey = null;
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        console.log("API Key removed.");
    }
}

/**
 * Retrieves the current OpenRouter API key from module state.
 * @returns {string|null} The API key or null if not set.
 */
export function getApiKey() {
    return openRouterApiKey;
}

/**
 * Initializes site context (URL and Name) needed for API headers.
 * Should be called once when the application loads.
 * @param {string} urlElementId - ID of the hidden input containing the site URL.
 * @param {string} nameElementId - ID of the hidden input containing the site name.
 */
export function initializeSiteContext(urlElementId = 'site-url', nameElementId = 'site-name') {
    const urlInput = document.getElementById(urlElementId);
    const nameInput = document.getElementById(nameElementId);
    siteUrl = urlInput ? urlInput.value : window.location.href;
    siteName = nameInput ? nameInput.value : document.title;
    console.log(`Site context initialized: URL=${siteUrl}, Name=${siteName}`);
}


/**
 * Fetches AI responses from the OpenRouter API based on the prompt type and context.
 * @param {string} promptType - The type of prompt (e.g., 'get_continuations', 'summarize').
 * @param {string} [context=''] - The text context from the editor.
 * @param {string} [customInstruction=''] - Additional instructions for specific prompt types.
 * @returns {Promise<{results?: string[], error?: string}>} A promise resolving to an object with results or an error message.
 */
export async function fetchAIResponse(promptType, context = '', customInstruction = '') {
    if (!openRouterApiKey) {
        console.error("OpenRouter API Key is not set.");
        return { error: "API Key not set." };
    }
     if (!siteUrl || !siteName) {
        console.warn("Site context not initialized. Call initializeSiteContext first.");
        // Attempt to initialize now as a fallback
        initializeSiteContext();
        if (!siteUrl || !siteName) {
             return { error: "Site context could not be determined for API headers." };
        }
    }

    console.log(`fetchAIResponse called with type: ${promptType}, context: "${context.substring(0, 50)}..."`);

    let userPrompt = "";
    // Truncate context based on MAX_CONTEXT_WORDS
    const truncatedContext = context.split(/\s+/).slice(-MAX_CONTEXT_WORDS).join(' ');
    // console.log(`Truncated context for prompt: "${truncatedContext.substring(0, 100)}..."`);

    // Construct the user prompt based on the type
    // NOTE: Case labels MUST match the promptType derived in uiHandlers.js (button ID minus '-btn')
    switch (promptType) {
        // --- Text Generation ---
        case 'get-continuations': // Matches 'get-continuations-btn'
            userPrompt = `Continue the following text seamlessly, maintaining the existing tone and style. Provide only the continued text, without any introduction or explanation.\n\nTEXT:\n"${truncatedContext}"\n\nCONTINUATION:`;
            break;
        case 'use-custom-prompt': // Matches 'use-custom-prompt-btn'
             if (!customInstruction) { console.error("Custom instruction missing for use-custom-prompt"); return { error: "Custom instruction required." }; }
            userPrompt = `Follow this instruction precisely for the given text. Provide only the resulting text, without any introduction or explanation.\n\nINSTRUCTION:\n${customInstruction}\n\nTEXT:\n"${truncatedContext}"\n\nRESULT:`;
            break;
        case 'get-prompts': // Matches 'get-prompts-btn'
            userPrompt = `Suggest 3 distinct writing prompts based on the following text. Each prompt should be on a new line. Provide only the prompts, without any numbering, introduction, or explanation.\n\nTEXT:\n"${truncatedContext}"\n\nPROMPTS:`;
            break;

        // --- Refinement & Style ---
        case 'change-tone': // Matches 'change-tone-btn'
             if (!customInstruction) { console.error("Custom instruction missing for change-tone"); return { error: "Tone instruction required." }; }
            userPrompt = `Rewrite the following text in the specified tone. Provide *only* the rewritten text, without any introduction or explanation.\n\n${customInstruction}\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
            break;
        case 'show-dont-tell': // Matches 'show-dont-tell-btn'
            userPrompt = `Rewrite the following text to "show" the action or emotion, not "tell" it, using vivid descriptions and actions. Provide *only* the rewritten text.\n\nExample Input: 'She was happy.'\nExample Output: 'A wide smile spread across her face as she skipped down the path.'\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
            break;
        case 'simplify': // Matches 'simplify-btn'
            userPrompt = `Rewrite the following text using simpler words and shorter sentences for easier understanding, while preserving the original meaning. Provide *only* the rewritten text.\n\nExample Input: 'The meteorological conditions precipitated an inundation.'\nExample Output: 'The weather caused a flood.'\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
            break;
        case 'elevate': // Matches 'elevate-btn'
            userPrompt = `Elevate the phrasing of the following text using more sophisticated, evocative, and precise language, without changing the core meaning. Provide *only* the rewritten text.\n\nExample Input: 'The food was good.'\nExample Output: 'The culinary preparation was exquisite.'\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
            break;
        case 'concise': // Matches 'concise-btn'
            userPrompt = `Rewrite the following text to be more concise, removing redundant words/phrases while preserving the essential meaning. Provide *only* the rewritten text.\n\nExample Input: 'Due to the fact that it was raining, we decided to cancel the picnic.'\nExample Output: 'Because it was raining, we cancelled the picnic.'\n\nTEXT TO REWRITE:\n"${truncatedContext}"\n\nREWRITTEN TEXT:`;
            break;

        // --- Idea Generation ---
        case 'expand': // Matches 'expand-btn'
            userPrompt = `Expand on the following idea or text, adding more detail, explanation, or related concepts. Provide only the expanded text, integrating naturally if possible.\n\nTEXT TO EXPAND:\n"${truncatedContext}"\n\nEXPANDED TEXT:`;
            break;
        case 'sensory': // Matches 'sensory-btn'
            userPrompt = `Enhance the following text by adding relevant sensory details (sight, sound, smell, taste, touch) to make it more immersive. Provide *only* the rewritten text with added details.\n\nTEXT TO ENHANCE:\n"${truncatedContext}"\n\nENHANCED TEXT:`;
            break;
        case 'whatif': // Matches 'whatif-btn'
            userPrompt = `Suggest 3 intriguing "What if?" scenarios or plot twists based on the following text. Each scenario should be on a new line. Provide only the scenarios, without any numbering, introduction, or explanation.\n\nTEXT:\n"${truncatedContext}"\n\nWHAT IF SCENARIOS:`;
            break;

        // --- Analysis & Structure ---
        case 'summarize': // Matches 'summarize-btn'
            userPrompt = `Provide a brief, concise summary (1-2 sentences) of the key points or main idea of the following text. Output *only* the summary sentence(s).\n\nTEXT TO SUMMARIZE:\n"${truncatedContext}"\n\nSUMMARY:`;
            break;
        case 'headline': // Matches 'headline-btn'
            userPrompt = `Suggest 3-5 compelling titles or headlines suitable for the following text. List each headline on a new line. Provide only the headlines, without any numbering, introduction, or explanation.\n\nTEXT:\n"${truncatedContext}"\n\nHEADLINES:`;
            break;

        default:
            // This case should ideally not be reached if all buttons have corresponding cases
            console.error(`Unknown prompt type received in fetchAIResponse: ${promptType}`);
            return { error: `Invalid request type received: ${promptType}` };
    }

    // console.log(`Final userPrompt being sent: "${userPrompt}"`);

    const messages = [{ "role": "user", "content": userPrompt }];
    const requestBody = {
        "model": DEFAULT_MODEL, // Use model from config
        "messages": messages,
        "max_tokens": 250, // Increased slightly
        "temperature": 0.7
    };

    // console.log("Sending request body to OpenRouter:", JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterApiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": siteUrl, // Use stored siteUrl
                "X-Title": siteName,     // Use stored siteName
            },
            body: JSON.stringify(requestBody)
        });

        console.log("API Response Status:", response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Unknown API error" }));
            console.error("API Error Response Body:", errorData);
            const message = errorData.error?.message || errorData.detail || 'Unknown error';
            // Provide more specific feedback for common errors
            if (response.status === 401) return { error: "API Error (401): Invalid API Key." };
            if (response.status === 429) return { error: "API Error (429): Rate limit exceeded or quota finished." };
            return { error: `API Error (${response.status}): ${message}` };
        }

        const data = await response.json();
        // console.log("Raw API Response Data:", JSON.stringify(data, null, 2));

        const choice = data.choices?.[0];
        const message = choice?.message;
        const content = message?.content;
        const finishReason = choice?.finish_reason;
        console.log("Parsed Content:", content ? content.substring(0,100)+'...' : 'N/A', "| Finish Reason:", finishReason);


        if (content !== undefined && content !== null && content.trim().length > 0) {
             // Split into lines, trim, and filter empty lines
             const results = content.split('\n')
                                    .map(line => line.trim())
                                    .filter(line => line.length > 0);
             console.log("Processed Results:", results);
             if (results.length === 0) {
                 console.warn("Splitting/filtering resulted in empty array, returning raw content as single item.");
                 return { results: [content.trim()] }; // Return raw trimmed content if filtering fails
             }
             return { results: results };
        } else {
             console.error("API response issue: 'content' field is missing, null, or empty.", data);
             if (finishReason === 'length') return { error: "API response cut short (max_tokens reached?)." };
             if (finishReason === 'content_filter') return { error: "API response blocked by content filter." };
             if (content !== undefined && content !== null && content.trim().length === 0) {
                 return { error: "Model returned only whitespace." };
             }
             return { error: "API returned an empty or unexpected response structure." };
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
             return { error: "Network error: Could not connect to the API." };
        }
         return { error: "Network error or failed to fetch." };
    }
}
