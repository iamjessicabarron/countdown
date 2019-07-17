# Countdown

I can barely keep track of what month it is, let alone what day. 
Countdown is a tiny Chrome Extension that tells you when stuff is, relative to right now.

---

### Getting started

1. Navigate to Manage Extensions at: `chrome://extensions/`
2. Turn on developer mode (top right)
3. Choose *Load unpacked*
4. After cloning the repo, load the `dist` folder

When making changes, make sure to either
- Use `gulp watch` to automatically transpile `src` JavaScript on save
- Use `gulp` to transpile your most recent changes (or if watch is being problematic)

You can access `popup.html` and dev tools for it via `chrome-extension://${ id }/dist/popup.html`


