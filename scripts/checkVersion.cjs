const { loadPackages, dependencyKeys } = require("./util.cjs");

const [ rootPkg, pkgs ] = loadPackages({ log: true });
const rootVersion = rootPkg.version;
console.log(`Root project version is ${rootVersion}`);

const pkgNames = Object.keys(pkgs);
let ok = true;

for (const [name, pkg] of Object.entries(pkgs)) {
  if (pkg.version !== rootVersion) {
    ok = false;
    console.error(`${name} (at ${pkg.path}) has version ${pkg.version} !`)
  }

  for (const key of dependencyKeys) {
    const deps = pkg[key];
    if (deps === undefined) continue;

    for (const dep of pkgNames) {
      const depVersion = deps[dep];
      if (depVersion !== undefined && depVersion !== rootVersion) {
        ok = false;
        console.error(`${name} (at ${pkg.path}) depends on ${dep} version ${depVersion} !`)
      }
    }
  }
}

if (ok) {
  console.log("All packages match.");
} else {
  process.exit(1);
}
