const { readFileSync } = require('fs');

function loadJSON(filename) {
  let file = readFileSync(filename);
  let obj = JSON.parse(file);
  return obj;
}

function loadPackages({ log = false } = {}) {
  const rootPkg = loadJSON("./package.json");
  const pkgs = {};
  for (const workspace of rootPkg.workspaces) {
    const pkg = loadJSON(`${workspace}/package.json`);
    pkg.path = workspace;
    pkgs[pkg.name] = pkg;
    if (log) console.log(`Found ${pkg.name} at ${workspace}`);
  };
  return [rootPkg, pkgs];
}

const dependencyKeys = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
];

module.exports = { loadJSON, loadPackages, dependencyKeys };
