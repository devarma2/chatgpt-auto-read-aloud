# ChatGPT Auto Read Aloud v6

Chrome extension for ChatGPT that automatically opens the latest assistant response's **More actions** menu and activates **Read aloud**.

## Install
1. Unzip this folder.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click **Load unpacked** and select this folder.
5. Reload ChatGPT.

## Test
Send a new message in ChatGPT. After the response finishes, the extension should open that response's **More actions** menu and activate **Read aloud**.

## Notes
ChatGPT changes its DOM frequently. This build specifically targets the controls observed in the diagnostic report and uses repeated searches for the lazily rendered menu item.
