/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const cp = require("child_process");

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
