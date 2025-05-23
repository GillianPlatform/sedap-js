const { readFileSync } = require('fs');

function loadJSON(filename) {
  let file = readFileSync(filename);
  let obj = JSON.parse(file);
  return obj;
}

function getRootPkg() {
  return loadJSON("./package.json");
}

function getPackageJSONPaths() {
  const rootPkg = getRootPkg();
  const paths = ["./package.json"];
  for (const workspace of rootPkg.workspaces) {
    paths.push(`${workspace}/package.json`);
  };
  return paths;
}

function loadPackages({ log = false } = {}) {
  const rootPkg = getRootPkg();
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

module.exports = { loadJSON, getRootPkg, getPackageJSONPaths, loadPackages, dependencyKeys };
