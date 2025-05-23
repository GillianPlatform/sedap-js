const { getPackageJSONPaths } = require("./util.cjs");
const fs = require("fs");

const versionPattern = /("version"\s*:\s*"\d+\.\d+\.)(\d+)"/g;
const depPattern = /("@gillianplatform\/sedap-.+"\s*:\s*"\d+\.\d+\.)(\d+)"/g;

const replaceVersion = (_, pre, n) => pre + (parseInt(n) + 1) + '"';

function processFile(path) {
  const content = fs.readFileSync(path).toString();
  const newContent = content
    .replace(versionPattern, replaceVersion)
    .replaceAll(depPattern, replaceVersion);
  fs.writeFileSync(path, newContent);
}

const paths = getPackageJSONPaths();
for (const path of paths) {
  processFile(path)
}
