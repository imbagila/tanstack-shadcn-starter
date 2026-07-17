import {
  buildFollowupMessage,
  getProjectRoot,
  readStdinJson,
  runBunScript,
  sanitizePath,
  writeJson,
} from "./hook-lib.mjs";

const VALIDATION_STEPS = [
  { script: "typecheck", command: "bun run typecheck" },
  { script: "lint", command: "bun run lint" },
  { script: "fmt:check", command: "bun run fmt:check" },
];

const main = () => {
  const input = readStdinJson();
  const status = input.status || "completed";

  if (status === "aborted") {
    writeJson({});
    process.exit(0);
  }

  sanitizePath();

  try {
    process.chdir(getProjectRoot());
  } catch {
    writeJson({});
    process.exit(0);
  }

  for (const step of VALIDATION_STEPS) {
    const result = runBunScript(step.script);

    if (result.error?.code === "ENOENT") {
      writeJson({
        followup_message: buildFollowupMessage({
          command: step.command,
          exitCode: 127,
          output: "Could not run bun. Ensure Bun is installed and available to Cursor hooks.",
        }),
      });
      process.exit(0);
    }

    if (result.status !== 0) {
      writeJson({
        followup_message: buildFollowupMessage({
          command: step.command,
          exitCode: result.status,
          output: result.output || "(no output)",
        }),
      });
      process.exit(0);
    }
  }

  writeJson({});
  process.exit(0);
};

main();
