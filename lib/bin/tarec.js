#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const minimist = require('minimist');

const showHelp = require('./showHelp');
const loadPackageJson = require('./loadPackageJson');
const createBabelConfig = require('../babel/createBabelConfig');
const addBuiltInCommands = require('../commands/addBuiltInCommands');
const loadUserConfig = require('./loadUserConfig');
const addConfiguredPlugins = require('../plugins/addConfiguredPlugins');
const Commands = require('../commands/Commands');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();

const userConfig = loadUserConfig(projectDir);

let indexPath = path.join(projectDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  indexPath = path.join(rootDir, 'lib/templates/index.ejs');
}

const tarecPkg = require(path.join(rootDir, 'package.json'))
const pkg = loadPackageJson(projectDir);

const context = {
  rootDir: rootDir,
  projectDir: projectDir,
  userConfig: userConfig,
  indexPath: indexPath,
  pkg: pkg,
  tarecPkg: tarecPkg
};

const commands = new Commands();
addBuiltInCommands(commands);
addConfiguredPlugins(context, commands);

const args = process.argv.slice(2);
if (args.length === 0 || args[0] == '-h' || args[0] == '--help') {
  showHelp(commands, tarecPkg);
  process.exit(0);
}
const commandName = args[0];
const commandArgs = minimist(args.slice(1));

if (commandName !== 'init') {
  context.webpackBabelConfig = createBabelConfig(context, true);
  context.babelConfig = createBabelConfig(context, false);
}

try {
  commands.runCommand(commandName, context, commandArgs);
} catch (e) {
  console.error(chalk.red(e.message));
  console.error(e.stack);
  showHelp(commands, tarecPkg);
  process.exit(1);
}
