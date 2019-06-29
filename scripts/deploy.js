#!/usr/bin/env node

const shell = require("shelljs")
const program = require('commander');
const semver = require("semver")

const version = require(__dirname + "/../package.json").version

program
  .option('-v, --semver <version>')
  .option('--npm-token <auth_token>')
  .action(() => {
    shell.cd(__dirname + "/..")

    if (!program.semver) {
      shell.echo("Semver not provided: --semver <version>")
      shell.echo("Try to parse semver from git tags")

      if (shell.exec("git rev-parse master").stdout !== shell.exec("git rev-parse HEAD").stdout) {
        shell.echo("This is not master branch")
        shell.exit(1)
      }

      const tags = shell.exec("git tag --points-at HEAD").stdout.split("\n")
      for (const tag of tags) {
        const re = /^v\d+\.\d+\.\d+-?[\w.]*$/
        if (re.test(tag)) {
          program.semver = tag
          break;
        }
      }
    }

    if (!semver.valid(program.semver)) {
      shell.echo("Invalid version provided " + program.semver)
      shell.exit(1)
    }

    if (!semver.valid(version)) {
      shell.echo("Invalid version " + version)
      shell.exit(1)
    }

    if (program.semver !== version) {
      shell.echo(`Packge version(${version}) and provided version(${program.semver}) don't match`)
      shell.exit(1)
    }

    if (!program.npmToken) {
      shell.echo("You should set npm token: --npm-token <auth_token>")
      shell.exit(1)
    }

    shell.echo("Build typescript...")
    if (shell.exec("npm run build").code !== 0) {
      shell.echo("Fail to build typescript")
      shell.exit(1)
    }

    if (shell.exec(`npm config set //registry.npmjs.org/:_authToken ${program.npmToken}`).code !== 0) {
      shell.echo("Fail to set npm token")
      shell.exit(1)
    }

    if (shell.exec("npm publish --verbose").code !== 0) {
      shell.echo("Fail to publish to npm")
      shell.exit(1)
    }
  })
  .parse(process.argv)
