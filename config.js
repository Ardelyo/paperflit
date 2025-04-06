// config.js - Application constants

// API Configuration
export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const DEFAULT_MODEL = "google/gemma-2-9b-it:free"; // Default model
export const MAX_CONTEXT_WORDS = 500; // Limit context sent to API

// Element IDs (Optional - can query directly in modules if preferred)
// export const EDITOR_CONTENT_ID = 'editor-content';
// export const TOOLBAR_ID = 'formatting-toolbar';
// export const WORD_COUNT_ID = 'word-count';
// export const API_KEY_INPUT_ID = 'api-key';
// export const SAVE_API_KEY_BTN_ID = 'save-api-key-btn';
// export const API_KEY_STATUS_ID = 'api-key-status';
// export const SIDEBAR_TOGGLE_ID = 'sidebar-toggle';
// ... add others if needed

// Local Storage Key
export const API_KEY_STORAGE_KEY = 'openRouterApiKey';
