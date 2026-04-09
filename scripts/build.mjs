import { execSync } from 'node:child_process';

const run = cmd => execSync(cmd, { encoding: 'utf8' }).trim();

const version = run('git rev-parse --short HEAD');
const branch = run('git rev-parse --abbrev-ref HEAD');
const buildTime = new Date().toISOString();

const cmd =
  `ng build --base-href / ` +
  `--define __GIT_VERSION__="'${version}'" ` +
  `--define __GIT_BRANCH__="'${branch}'" ` +
  `--define __BUILD_TIME__="'${buildTime}'"`;

execSync(cmd, { stdio: 'inherit' });
