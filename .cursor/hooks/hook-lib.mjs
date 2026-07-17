import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const SPAWN_MAX_BUFFER_BYTES = 16 * 1024 * 1024;
const OUTPUT_TRUNCATE_BYTES = 12_000;

const LINT_FIX_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

export const readStdinJson = () => {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
};

export const getProjectRoot = () => process.env.CLAUDE_PROJECT_DIR || join(__dirname, "../..");

export const sanitizePath = () => {
  const skip = [".cursor-server", ".vscode-server"];
  const parts = (process.env.PATH || "")
    .split(":")
    .filter((entry) => entry && !skip.some((token) => entry.includes(token)));
  process.env.PATH = parts.join(":");
};

export const truncateOutput = (text, maxBytes = OUTPUT_TRUNCATE_BYTES) => {
  if (text.length <= maxBytes) {
    return text;
  }
  return `${text.slice(0, maxBytes)}\n...(truncated)`;
};

export const runBunScript = (script, args = [], cwd = getProjectRoot()) => {
  const result = spawnSync("bun", ["run", script, "--", ...args], {
    cwd,
    encoding: "utf8",
    maxBuffer: SPAWN_MAX_BUFFER_BYTES,
    env: process.env,
  });

  return {
    status: result.status ?? 1,
    output: `${result.stdout || ""}${result.stderr || ""}`.trim(),
    error: result.error,
  };
};

export const isLintFixableFile = (filePath) => {
  const extension = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
  return LINT_FIX_EXTENSIONS.has(extension);
};

export const fileExists = (filePath) => existsSync(filePath);

export const writeJson = (payload) => {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
};

export const buildFollowupMessage = ({ command, exitCode, output }) =>
  [
    "The stop hook ran automated validation after your last agent turn.",
    "",
    `**Command:** \`${command}\``,
    `**Result:** failed with exit code **${exitCode}**.`,
    "",
    "Fix the issues below, then continue. Hooks already auto-format edits and run React Doctor on changed files.",
    "",
    "```text",
    truncateOutput(output),
    "```",
  ].join("\n");
