# ChatGPT Auto Read Aloud

A lightweight Chrome extension that automatically clicks **Read aloud** after ChatGPT finishes generating a response.

If you use ChatGPT as a hands-free or personal companion, this removes the need to manually open the **More actions (⋯)** menu and click **Read aloud** after every response.

## ✨ Features

* 🔊 Automatically reads ChatGPT responses aloud
* 🤖 Detects when a response has finished generating
* ⋯ Automatically opens the response's **More actions** menu
* ▶️ Automatically selects **Read aloud**
* 🚫 Prevents the same response from being read more than once
* 🎛️ Simple ON/OFF toggle
* 🔒 No backend or external server
* 🔐 Conversation content never leaves your browser

## 📦 Installation

This extension is currently distributed as an **unpacked Chrome extension**.

### 1. Download the project

Clone the repository:

```bash
git clone https://github.com/devarma2/chatgpt-auto-read-aloud.git
```

Or download the repository as a ZIP from GitHub and extract it.

### 2. Open Chrome's extension page

Navigate to:

```text
chrome://extensions
```

### 3. Enable Developer Mode

Turn on **Developer mode** in the upper-right corner.

### 4. Load the extension

Click **Load unpacked** and select the project's root directory.

### 5. Open ChatGPT

Open:

```text
https://chatgpt.com/
```

Refresh the page if it was already open.

The extension should now automatically read new ChatGPT responses aloud.

## ⚙️ How It Works

ChatGPT dynamically renders its interface, and the **Read aloud** control isn't always present in the page until the response's action menu is opened.

The extension therefore follows roughly this sequence:

```text
ChatGPT generates response
        ↓
Response finishes
        ↓
Find the latest assistant response
        ↓
Find "More actions" (⋯)
        ↓
Open the menu
        ↓
Wait for "Read aloud" to appear
        ↓
Click "Read aloud"
        ↓
🔊 Response is spoken
```

The extension uses a `MutationObserver` and periodic checks to accommodate ChatGPT's dynamically changing interface.

## 🎛️ Enable / Disable

Click the extension icon in Chrome to open the popup.

You can toggle:

**Automatically read responses**

off whenever you don't want ChatGPT to speak.

Your setting is saved using Chrome's extension storage.

## 🔒 Privacy

This extension does **not** have a backend server and does not transmit your conversations anywhere.

It operates directly on the ChatGPT webpage and interacts with the existing ChatGPT interface.

The extension does not:

* Collect conversations
* Store conversation contents
* Send data to external servers
* Track browsing activity
* Require an account
* Use analytics or advertising

The extension only needs access to ChatGPT pages so that it can interact with the page's controls.

## ⚠️ Compatibility

This extension is designed for:

* Google Chrome
* `chatgpt.com`
* `chat.openai.com`

### ChatGPT UI changes

The extension relies on elements in ChatGPT's webpage, including the **More actions** and **Read aloud** controls.

Because ChatGPT's interface can change over time, a future ChatGPT UI update may cause the extension to stop working.

If that happens, please open an issue with:

1. Your Chrome version
2. Whether **More actions** opens automatically
3. Whether **Read aloud** appears in the menu
4. Any errors shown on `chrome://extensions`

## 🐛 Troubleshooting

### The extension doesn't read responses

Try:

1. Open `chrome://extensions`
2. Find **ChatGPT Auto Read Aloud**
3. Make sure it is enabled
4. Click **Reload**
5. Refresh the ChatGPT tab
6. Send a new message

### The menu opens but Read aloud doesn't activate

This usually indicates that ChatGPT has changed how its menu is rendered.

Please open an issue with details about what happens.

### Nothing happens at all

Make sure the extension has permission to run on `chatgpt.com` and that you're using the latest version of the extension.

## 🛠️ Development

The project is intentionally small and dependency-free.

```text
chatgpt-auto-read-aloud/
├── manifest.json
├── content.js
├── popup.html
├── popup.js
└── README.md
```

No build system or package manager is required.

After modifying the extension:

1. Open `chrome://extensions`
2. Click **Reload** on the extension
3. Refresh the ChatGPT tab
4. Test with a new response

## 🤝 Contributing

Pull requests and bug reports are welcome.

If ChatGPT changes its UI and breaks the extension, contributions that update the relevant selectors or detection logic are especially appreciated.

Before submitting a PR, please test:

* A normal ChatGPT response
* Multiple consecutive responses
* A long response
* A short response
* Regenerated responses
* The extension's ON/OFF toggle

## 📄 License

MIT License

Copyright (c) 2026

## Disclaimer

**ChatGPT Auto Read Aloud is an unofficial, community-developed extension and is not affiliated with, sponsored by, or endorsed by OpenAI.**

ChatGPT is a trademark of OpenAI.
