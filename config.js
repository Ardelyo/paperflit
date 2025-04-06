// config.js - Application constants

// API Configuration
export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const DEFAULT_MODEL = "google/gemma-2-9b-it:free"; // Default model
export const MAX_CONTEXT_WORDS = 500; // Limit context sent to API

export const OPENROUTER_API_KEY = "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"; // This will be replaced by GitHub Actions

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
