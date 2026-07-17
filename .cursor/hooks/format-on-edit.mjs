import {
  fileExists,
  getProjectRoot,
  isLintFixableFile,
  readStdinJson,
  runBunScript,
  sanitizePath,
} from "./hook-lib.mjs";

const main = () => {
  const input = readStdinJson();
  const filePath = input.file_path;

  if (!filePath || !fileExists(filePath)) {
    process.exit(0);
  }

  sanitizePath();

  try {
    process.chdir(getProjectRoot());
  } catch {
    process.exit(0);
  }

  runBunScript("fmt", ["--no-error-on-unmatched-pattern", filePath]);

  if (isLintFixableFile(filePath)) {
    runBunScript("lint:fix", [filePath]);
  }

  process.exit(0);
};

main();
