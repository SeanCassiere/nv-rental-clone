const fs = require("node:fs");
const cp = require("node:child_process");

const packageJson = require("./package.json");

const commitHash = cp
  .execSync("git rev-parse --short HEAD")
  .toString()
  .replace("\n", "");

const meta = {
  version: packageJson.version + "-" + commitHash,
};
const data = JSON.stringify(meta);

if (fs.existsSync("dist")) {
  fs.writeFileSync("dist/meta.json", data, { encoding: "utf8" });
  console.log('postbuild: Wrote application metadata to "dist/meta.json"');
  console.log("postbuild:", data);
}
