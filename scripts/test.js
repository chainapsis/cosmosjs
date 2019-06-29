#!/usr/bin/env node

const shell = require("shelljs")

shell.cd(__dirname)
shell.cd("../")
if (shell.exec("npm run test").code !== 0) {
  shell.echo("Fail to pass tests")
  shell.exit(1)
}
