# Security

This bookmarklet executes inside `chatgpt.com` and performs permanent deletion of user-selected conversations.

- It does not contain a hard-coded access token.
- It does not send data to third-party origins.
- It obtains the current session access token from ChatGPT at deletion time and keeps it only in memory.
- Do not include access tokens, cookies, or private conversation content in public bug reports.

Because it relies on undocumented ChatGPT web-app internals, review changes carefully before running updated versions.
