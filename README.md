<p align="center">
  <a href="https://zeptap.com"><img src="https://raw.githubusercontent.com/Zeptap/mcp/main/.github/assets/hero.png" alt="Zeptap: let Claude Code test your app on a real iPhone" width="100%"></a>
</p>

<p align="center">
  <b>Let AI agents see, tap, swipe and type on a real iPhone.</b><br>
  MCP configs, a Claude Code plugin, an agent skill and a stdio relay for the Zeptap Mac app.
</p>

<p align="center">
  <a href="https://github.com/Zeptap/releases/releases/latest/download/Zeptap.dmg"><img src="https://img.shields.io/badge/Download_for_Mac-000000?style=for-the-badge&logo=apple&logoColor=white" alt="Download for Mac"></a>
  &nbsp;
  <a href="https://zeptap.com/docs/agents/tools"><img src="https://img.shields.io/badge/Tool_reference-3B82F6?style=for-the-badge" alt="Tool reference"></a>
  &nbsp;
  <a href="https://zeptap.com/pricing"><img src="https://img.shields.io/badge/Pricing-22C55E?style=for-the-badge" alt="Pricing"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MCP-Streamable_HTTP_%2B_stdio-555" alt="MCP: Streamable HTTP and stdio">
  <img src="https://img.shields.io/badge/macOS-14%2B-555" alt="macOS 14 or later">
  <img src="https://img.shields.io/badge/first_hour-free-22C55E" alt="First hour free">
  <img src="https://img.shields.io/badge/this_repo-MIT-3B82F6" alt="This repo is MIT licensed">
</p>

---

## What it is

Zeptap is a Mac app that lets AI agents operate a real iPhone. The Mac reads the iPhone screen over USB and sends taps and typing over Bluetooth through AssistiveTouch. The app runs a local MCP server at `http://127.0.0.1:47801/mcp` (Streamable HTTP, loopback only, no auth). Every action returns a screenshot, so the agent checks its own work.

Use it to test your own iOS apps on a physical device, or to hand everyday phone tasks to the agent you already use.

> "open my app and walk through signup" · "screenshot every screen in dark mode" · "turn on Low Power Mode" · "find the wifi password in Settings"

This repo holds the client configs, plugin, skill and relay. It does not contain the app.

## Good to know

**🔌 Nothing to install on the iPhone.**
No Xcode, no Developer Mode, no Apple Developer account. The only step on the phone is Bluetooth pairing.

**📱 Real iPhone, not a simulator.**
App Store apps, Settings, Safari, Messages, TestFlight builds. If you can tap it, the agent can.

**🔒 Local only.**
The MCP server only accepts connections from the same Mac. Screenshots go only to the agent you connect. See [privacy](https://zeptap.com/docs/reference/privacy).

**💳 Paid Mac app, first hour free.**
The Mac app is closed source. After the first hour of live use: $25/month, $99 once, or $199 once for up to 5 iPhones. See [pricing](https://zeptap.com/pricing). Everything in this repo is MIT.

## Get started

1. **[Download Zeptap](https://github.com/Zeptap/releases/releases/latest/download/Zeptap.dmg)**, or `brew install --cask zeptap/tap/zeptap`.
2. **Connect your iPhone** with a USB cable, tap Trust, and pair Bluetooth in the setup assistant.
3. **Add the server to your agent** (below), then ask it to take a screenshot.

**You need:** a Mac on macOS 14 or later with Bluetooth, an iPhone, and a USB cable.

## Connect your agent

<details open>
<summary><b>Claude Code</b></summary>

```sh
claude mcp add --transport http --scope user zeptap http://127.0.0.1:47801/mcp
```

Or install the plugin, which adds the server and the skill:

```text
/plugin marketplace add zeptap/mcp
/plugin install zeptap@zeptap
```
</details>

<details>
<summary><b>Cursor</b></summary>

`~/.cursor/mcp.json`:

```json
{ "mcpServers": { "zeptap": { "url": "http://127.0.0.1:47801/mcp" } } }
```
</details>

<details>
<summary><b>Codex</b></summary>

`~/.codex/config.toml`:

```toml
[mcp_servers.zeptap]
url = "http://127.0.0.1:47801/mcp"
```
</details>

<details>
<summary><b>VS Code</b></summary>

`.vscode/mcp.json`:

```json
{ "servers": { "zeptap": { "type": "http", "url": "http://127.0.0.1:47801/mcp" } } }
```
</details>

<details>
<summary><b>Claude Desktop and other stdio clients</b></summary>

```json
{ "mcpServers": { "zeptap": { "command": "npx", "args": ["-y", "@zeptap/mcp"] } } }
```

Or without Node:

```json
{ "mcpServers": { "zeptap": { "command": "/Applications/Zeptap.app/Contents/MacOS/Zeptap", "args": ["--stdio"] } } }
```
</details>

**Check it works** (with Zeptap open):

```sh
curl -s http://127.0.0.1:47801/mcp -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Tools

| Tool | What it does |
|---|---|
| `list_phones` | The iPhones connected to this Mac, with ids to pass as `phone` |
| `screenshot` | Current iPhone screen as an image |
| `find_text` | On-device OCR of screen text, optional filter |
| `wait` | Wait, then return a settled screenshot |
| `load_skill` | Return a built-in app guide |
| `tap`, `double_tap`, `long_press` | Touch at x, y |
| `tap_text` | Tap a visible text label |
| `drag`, `flick` | Drag between points, or scroll in a direction |
| `type_text`, `press_key` | Type text, or press a key with modifiers |
| `home`, `back`, `dismiss` | Home Screen, go back, close sheets or keyboard |
| `open_app` | Open an installed app by name |
| `lock`, `unlock` | Lock over USB, unlock with a passcode saved in the Keychain (opt in) |

Every action returns a screenshot after the screen settles. Every tool except `list_phones` takes an optional `phone`; without it, tools act on the iPhone that is active in Zeptap. Full reference: **[zeptap.com/docs/agents/tools](https://zeptap.com/docs/agents/tools)**.

## What's in this repo

| Path | What it is |
|---|---|
| [`skills/zeptap/SKILL.md`](skills/zeptap/SKILL.md) | Agent skill: connection check, look-act-verify loop, when to ask first. Copy to `~/.claude/skills/` or install the plugin |
| [`.claude-plugin/`](.claude-plugin) | Claude Code plugin and marketplace manifest |
| [`.mcp.json`](.mcp.json) | MCP config the plugin installs |
| [`bin/zeptap-mcp.js`](bin/zeptap-mcp.js) | `@zeptap/mcp`, a stdio relay that starts `Zeptap --stdio`. Set `ZEPTAP_BIN` if the app is not in `/Applications` |
| [`server.json`](server.json), [`smithery.yaml`](smithery.yaml) | Registry manifests |

## FAQ

<details>
<summary><b>Does it work with Android or the iOS Simulator?</b></summary>

No. Zeptap drives a real iPhone that is cabled to the Mac. Windows, Linux and remote phones are not supported either.
</details>

<details>
<summary><b>Can it run several iPhones?</b></summary>

Yes. Call `list_phones`, then pass `phone` on each call. Calls for different phones run side by side. Up to 5 iPhones need the Lifetime Plus license.
</details>

<details>
<summary><b>What is it for?</b></summary>

Testing your own iOS apps and automating your own accounts and apps. Not for fake engagement, bulk account creation or device spoofing.
</details>

## Support

Email **[support@zeptap.com](mailto:support@zeptap.com)** or read the **[docs](https://zeptap.com/docs)**. Errors are covered in [troubleshooting](https://zeptap.com/docs/reference/troubleshooting).

<p align="center"><sub>Made by <a href="https://zeptap.com">Afterlume Labs</a></sub></p>
