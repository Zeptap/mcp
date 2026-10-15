---
name: zeptap
description: Operate a real iPhone connected to this Mac through the Zeptap MCP server. Use when the user asks to do something on their iPhone, check or reply to something in an iPhone app, or test an iOS app on a physical phone. Requires the Zeptap Mac app running with an iPhone connected by USB and paired over Bluetooth. Not for Android, the iOS Simulator or remote phones.
license: MIT
compatibility: macOS 14 or later with the Zeptap app running; MCP server at http://127.0.0.1:47801/mcp
---

# Operating an iPhone with Zeptap

The phone is real: taps, messages and purchases have real effects.

## Check the connection

1. Call `screenshot`. If it fails with a connection error, ask the user to open the Zeptap app. If it reports no screen frame, ask them to check the USB cable and unlock the phone (or call `unlock` once if they allowed it).
2. If the Zeptap tools are missing, tell the user to run:
   `claude mcp add --transport http --scope user zeptap http://127.0.0.1:47801/mcp`
3. If more than one iPhone may be connected, call `list_phones` and pass the right id as `phone` on every call.

## Operating loop

1. Look: `screenshot` or `find_text` to read what is on screen.
2. Act with one tool: prefer `tap_text` over `tap` coordinates. Use `open_app` to launch apps, `type_text` to type, `flick` to scroll, `home`, `back` and `dismiss` to navigate.
3. Check the screenshot every action returns before the next step. If nothing changed, try a different target instead of repeating.
4. If the screen is still loading or animating, call `wait` and look again instead of tapping again.
5. If a built-in guide exists for the app you are about to use, call `load_skill` with the app name first.

## Ask the user first

Stop and confirm before purchases, posting, deleting anything, or messaging someone new, unless the user already said to do it.

## Tools (19)

list_phones, screenshot, find_text, wait, load_skill, tap, tap_text, double_tap, long_press, drag, flick, type_text, press_key, home, back, dismiss, open_app, lock, unlock.

- Arguments: https://zeptap.com/docs/agents/tools
- Detailed rules: https://zeptap.com/docs/agents/driving
- Errors: https://zeptap.com/docs/reference/troubleshooting
