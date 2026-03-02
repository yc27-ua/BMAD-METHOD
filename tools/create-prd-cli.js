#!/usr/bin/env node
const { createPrd } = require('./lib/create-prd');

function parseArgs(argvRaw) {
  const args = {};
  argvRaw.forEach(a => {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      args[k] = v === undefined ? true : v;
    }
  });
  return args;
}

(async function main(){
  try {
    const argv = parseArgs(process.argv.slice(2));
    const opts = {
      project_name: argv.project_name || argv.project || argv.p,
      user_name: argv.user_name || argv.user || argv.u,
      outputPath: argv.output || argv.o || 'docs/prd.md',
      epicsPath: argv.epics || 'planning/epics.md',
      overwrite: argv.overwrite === 'true' || argv.overwrite === true
    };
    const res = await createPrd(opts);
    console.log('PRD generated:', res.outputPath);
    process.exit(0);
  } catch (err) {
    console.error('Error generating PRD:', err && err.message || err);
    process.exit(2);
  }
})();
