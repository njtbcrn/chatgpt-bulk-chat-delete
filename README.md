# ChatGPT Bulk Chat Delete

[![Release](https://img.shields.io/github/v/release/njtbcrn/chatgpt-bulk-chat-delete)](https://github.com/njtbcrn/chatgpt-bulk-chat-delete/releases/latest)
[![License](https://img.shields.io/github/license/njtbcrn/chatgpt-bulk-chat-delete)](LICENSE)
![Chrome](https://img.shields.io/badge/Chrome-tested-success)
![Edge](https://img.shields.io/badge/Edge-tested-success)
![Opera](https://img.shields.io/badge/Opera-tested-success)

A small bookmarklet that adds explicit selection boxes to ChatGPT's conversation sidebar so you can inspect chats normally, select only the ones you want, and permanently delete the selected chats in bulk.

**Tested manually:** Chrome, Edge, Opera (October 2026).

> [!WARNING]
> Deletion is permanent. The bookmarklet asks for confirmation before deleting anything.

## What it does

- Adds a `□` selector beside each visible conversation.
- Keeps conversation titles clickable, so you can open and inspect a chat before selecting it.
- Lets you clear the current selection.
- Deletes only the conversations you explicitly selected.
- Fetches the current ChatGPT session access token at deletion time; it does **not** embed, save, or transmit your token elsewhere.
- Adds a close button to remove the cleaner UI.

## Install

### Drag-and-drop install

After downloading the project, open `INSTALL.html` in your browser and drag the **ChatGPT Bulk Chat Delete** button to your bookmarks bar. This avoids copy/paste corruption of the bookmarklet.

> GitHub intentionally sanitizes `javascript:` links in rendered Markdown, so the README itself cannot safely provide a live drag-to-bookmarks JavaScript link. `INSTALL.html` is included for that purpose.

### Manual install

1. Create a new bookmark in your browser.
2. Name it `ChatGPT Bulk Chat Delete` (or anything you like).
3. Open [`bookmarklet.min.js`](bookmarklet.min.js), copy the entire single line beginning with `javascript:`, and paste it into the bookmark's **URL / Address** field.
4. Open ChatGPT and click the bookmark.

If your browser strips `javascript:` while pasting, type `java` manually first and then paste the remainder beginning with `script:`.

## Use

1. Click the bookmark while on ChatGPT.
2. Use `□` to select a conversation; it becomes `☑` when selected.
3. Click conversation titles normally if you want to inspect them first.
4. Click **Delete selected**.
5. Verify the number in the confirmation dialog and confirm.

## Security / privacy

The bookmarklet runs locally in the ChatGPT page. It requests the current session data from `/api/auth/session` and uses the returned access token only in memory to authorize deletion requests to the same ChatGPT origin. The code contains no analytics, external requests, account IDs, conversation IDs, or hard-coded tokens.

You should still review bookmarklet code before running it. Never paste an access token into an issue, chat, screenshot, or public post.

## Compatibility and limitations

This project relies on ChatGPT's current web UI and internal, undocumented endpoints. It is **not an official OpenAI API integration**. OpenAI may change the sidebar DOM, session response, or conversation deletion endpoint at any time, which can break the bookmarklet.

Currently verified manually on desktop Chrome, Edge, and Opera (October 2026). Other browsers may work but are not yet verified.

## Files

- `bookmarklet.js` — readable source.
- `bookmarklet.min.js` — one-line bookmarklet to paste into a bookmark URL.
- `INSTALL.html` — local drag-to-bookmarks installer.
- `LICENSE` — MIT License.

## Disclaimer

Unofficial community tool. Not affiliated with, endorsed by, or supported by OpenAI. ChatGPT and OpenAI are trademarks of their respective owner.

## License

MIT
