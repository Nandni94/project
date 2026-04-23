const { spawn } = require("child_process");
const path = require("path");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function run(name, cwd, args) {
  const child = spawn(npmCmd, args, {
    cwd,
    stdio: "inherit",
    shell: false
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }
  });

  return child;
}

const rootDir = path.resolve(__dirname, "..");
const backendDir = path.join(rootDir, "backend");
const clientDir = path.join(rootDir, "client");

const backend = run("backend", backendDir, ["start"]);
const client = run("client", clientDir, ["start"]);

function shutdown() {
  backend.kill();
  client.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
