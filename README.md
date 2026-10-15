# Zeptap MCP

Zeptap is a Mac app that lets AI agents see and operate a real iPhone. The Mac reads the iPhone screen over USB and sends taps and typing over Bluetooth through AssistiveTouch. The app runs a local MCP server at `http://127.0.0.1:47801/mcp` (Streamable HTTP, loopback only, no auth).

This repo holds the MCP client configs, a Claude Code plugin, an agent skill and a small stdio relay for the app. It does not contain the app.

- Requires a Mac with macOS 14 or later and Bluetooth, and an iPhone on a USB cable.
- Nothing is installed on the iPhone. No Xcode, Developer Mode or Apple Developer account.
- The Mac app is closed source and paid. The first hour of live use is free. Then $25/month, $99 once, or $149 once for up to 5 iPhones. See https://zeptap.com/pricing
- This repo (configs, skill, relay, docs) is MIT licensed. The Mac app itself is proprietary.

## Install

1. Download the app: https://github.com/Zeptap/releases/releases/latest/download/Zeptap.dmg
   or with Homebrew: `brew install --cask zeptap/tap/zeptap`
2. Open Zeptap, plug in the iPhone, tap Trust, and pair Bluetooth in the setup assistant.
3. Add the server to your agent (below).

## Client setup

Claude Code:

    claude mcp add --transport http --scope user zeptap http://127.0.0.1:47801/mcp

Claude Code plugin (adds the server and the skill):

    /plugin marketplace add zeptap/mcp
    /plugin install zeptap@zeptap

Cursor (`~/.cursor/mcp.json`):

    { "mcpServers": { "zeptap": { "url": "http://127.0.0.1:47801/mcp" } } }

Codex (`~/.codex/config.toml`):

    [mcp_servers.zeptap]
    url = "http://127.0.0.1:47801/mcp"

VS Code (`.vscode/mcp.json`):

    { "servers": { "zeptap": { "type": "http", "url": "http://127.0.0.1:47801/mcp" } } }

Claude Desktop and other stdio clients:

    { "mcpServers": { "zeptap": { "command": "npx", "args": ["-y", "@zeptap/mcp"] } } }

or without Node:

    { "mcpServers": { "zeptap": { "command": "/Applications/Zeptap.app/Contents/MacOS/Zeptap", "args": ["--stdio"] } } }

Check it works:

    curl -s http://127.0.0.1:47801/mcp -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

## Tools (19)

| Tool | What it does |
|---|---|
| list_phones | The iPhones connected to this Mac, with ids to pass as `phone` |
| screenshot | Current iPhone screen as an image |
| find_text | On-device OCR of screen text, optional filter |
| wait | Wait a number of milliseconds |
| load_skill | Return a built-in app guide |
| tap, double_tap, long_press | Touch at x, y |
| tap_text | Tap a visible text label |
| drag, flick | Drag between points, or scroll in a direction |
| type_text, press_key | Type text, or press a key with modifiers |
| home, back, dismiss | Home Screen, go back, close sheets or keyboard |
| open_app | Open an installed app by name |
| lock, unlock | Lock over USB, unlock with a passcode saved in the Keychain (opt in) |

Every action returns a screenshot after the screen settles. Every tool except `list_phones` takes an optional `phone` argument; without it, tools act on the iPhone that is active in Zeptap. Full reference: https://zeptap.com/docs/agents/tools

## Agent skill

`skills/zeptap/SKILL.md` follows the Agent Skills format. Copy the folder to `~/.claude/skills/` or install this repo as a Claude Code plugin.

## npm relay

`@zeptap/mcp` is a small stdio relay that starts `Zeptap --stdio`. It is for clients that only speak stdio and for registries that need a package. Source: `bin/zeptap-mcp.js`. Set `ZEPTAP_BIN` if the app is not in `/Applications`.

## Privacy

The MCP server only accepts connections from the same Mac. Screenshots go only to the agent you connect. See https://zeptap.com/docs/reference/privacy

## Intended use

Testing your own iOS apps and automating your own accounts and apps. Not for fake engagement, bulk account creation or device spoofing.

## Not supported

Android, the iOS Simulator, Windows, Linux, phones not cabled to the Mac.

## Support

support@zeptap.com. Docs: https://zeptap.com/docs
