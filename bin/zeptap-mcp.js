#!/usr/bin/env node
// stdio relay: runs the Zeptap app binary in --stdio mode and passes stdin/stdout through.
const { spawn } = require("node:child_process");
const fs = require("node:fs");

const bin = process.env.ZEPTAP_BIN || "/Applications/Zeptap.app/Contents/MacOS/Zeptap";
if (process.platform !== "darwin" || !fs.existsSync(bin)) {
  process.stderr.write(
    "Zeptap app not found at " + bin + ". Install it from https://zeptap.com and open it, or set ZEPTAP_BIN.\n"
  );
  process.exit(1);
}
const child = spawn(bin, ["--stdio"], { stdio: "inherit" });
child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
