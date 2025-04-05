# Magic Text Editor - Enhanced

## Overview

Magic Text Editor - Enhanced is a web-based rich text editor designed to seamlessly integrate powerful AI writing assistance tools directly into the editing experience. It provides standard text formatting capabilities alongside a suite of AI features powered by the OpenRouter API.

The editor uses the [TipTap](https://tiptap.dev/) library for its core rich text functionality and features a modern user interface styled according to Material Design 3 principles.

## Features

### Rich Text Editing
*   Standard formatting: Bold, Italic, Underline, Strikethrough
*   Headings (H1, H2, H3)
*   Lists (Bulleted and Numbered)
*   Blockquotes
*   Code Blocks (Inline and Block)
*   Text Alignment (Left, Center, Right, Justify)
*   Undo/Redo
*   Word Count

### AI Writing Assistance (Powered by OpenRouter)
A collapsible sidebar provides access to various AI tools (requires an OpenRouter API key):
*   **Text Generation:**
    *   **Continue:** Generate text to continue the current writing.
    *   **Custom Prompt:** Apply a user-defined instruction to the text.
    *   **Suggest Prompts:** Get writing prompt ideas based on the current text.
*   **Refinement & Style:**
    *   **Change Tone:** Rewrite selected text in different tones (Formal, Casual, Mysterious, etc.).
    *   **Show, Don't Tell:** Rewrite selection to emphasize actions and descriptions over stating emotions.
    *   **Simplify Text:** Rewrite selection using simpler language.
    *   **Elevate Phrasing:** Rewrite selection with more sophisticated language.
    *   **Make Concise:** Shorten the selected text while preserving meaning.
*   **Idea Generation:**
    *   **Expand Idea:** Elaborate on the selected text or concept.
    *   **Add Sensory Details:** Enrich selected descriptions with sensory information.
    *   **Suggest "What Ifs":** Generate alternative plot points or scenarios based on the text.
*   **Analysis & Structure:**
    *   **Summarize Selection:** Create a concise summary of the selected text.
    *   **Suggest Titles:** Generate potential titles for the entire document.

### User Interface
*   Clean, modern UI based on Material Design 3.
*   Collapsible sidebar for AI tools.
*   Responsive formatting toolbar.
*   Dedicated output areas for AI suggestions, often clickable for easy insertion.

## Technology Stack

*   **Frontend:** HTML5, CSS3, JavaScript (ES Modules)
*   **Rich Text Editor:** [TipTap](https://tiptap.dev/) (v2)
*   **AI Integration:** [OpenRouter API](https://openrouter.ai/) (using `google/gemma-2-9b-it:free` model by default)
*   **Styling:** Custom CSS implementing Material Design 3 principles.
*   **Dependencies:** Fetched via CDN (`esm.sh`) - no local build step required.

## Setup & Usage

1.  **Clone/Download:** Get the project files (`index.html`, `style.css`, `script.js`, `editor.js`).
2.  **Serve Locally:** Use a simple HTTP server (like Python's `http.server` or VS Code's Live Server extension) to serve the `index.html` file. This is necessary because the project uses ES Modules.
3.  **Open in Browser:** Navigate to the local server address (e.g., `http://localhost:8000`).
4.  **Add API Key:**
    *   Obtain an API key from [OpenRouter.ai](https://openrouter.ai/).
    *   Enter the key into the "OpenRouter API Key" input field in the sidebar and click "Save".
    *   The AI tool buttons will become enabled once a valid key is saved (stored in browser local storage).
5.  **Write & Use Tools:** Start writing in the main editor pane. Use the formatting toolbar and the AI tools in the sidebar as needed. Select text before using tools marked with "(Select Text)".

## File Structure

*   `index.html`: Main HTML structure, includes editor layout, toolbar, and sidebar elements.
*   `style.css`: Contains all CSS rules for styling, implementing the Material Design 3 theme.
*   `editor.js`: Initializes and configures the TipTap editor instance and its extensions.
*   `script.js`: Handles application logic, UI interactions (toolbar, sidebar toggle), API key management, OpenRouter API calls, and displaying AI results.
*   `README.md`: This file.
