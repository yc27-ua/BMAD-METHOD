const fs = require('fs-extra');
const path = require('path');

async function createPrd(opts = {}) {
  const root = opts.root || process.cwd();
  const templatePath = opts.templatePath || path.join(root, 'src', 'bmm', 'workflows', '2-plan-workflows', 'create-prd', 'templates', 'prd-template.md');
  const outputPath = path.isAbsolute(opts.outputPath || '') && (opts.outputPath) ? opts.outputPath : path.join(root, opts.outputPath || 'docs/prd.md');
  const epicsPath = opts.epicsPath || path.join(root, 'planning', 'epics.md');
  const projectName = opts.project_name || opts.projectName || 'Project';
  const userName = opts.user_name || opts.userName || 'Automated Bot';
  const date = opts.date || new Date().toISOString().slice(0, 10);
  const overwrite = opts.overwrite === true;

  // Ensure output dir exists
  await fs.ensureDir(path.dirname(outputPath));

  let template = null;
  try {
    template = await fs.readFile(templatePath, 'utf8');
  } catch (e) {
    // fallback minimal template
    template = `---\nstepsCompleted: []\ninputDocuments: []\nworkflowType: 'prd'\n---\n\n# Product Requirements Document - {{project_name}}\n\n**Author:** {{user_name}}\n**Date:** {{date}}\n`;
  }

  const content = template.replace(/{{\s*project_name\s*}}/g, projectName).replace(/{{\s*user_name\s*}}/g, userName).replace(/{{\s*date\s*}}/g, date);

  // Handle existing file
  if (!overwrite && await fs.pathExists(outputPath)) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = `${outputPath}.bak-${ts}`;
    await fs.copy(outputPath, backup);
  }

  await fs.writeFile(outputPath, content, 'utf8');

  // Update epics file minimally: add reference if not present
  try {
    await fs.ensureDir(path.dirname(epicsPath));
    let epics = '';
    if (await fs.pathExists(epicsPath)) epics = await fs.readFile(epicsPath, 'utf8');
    const refLine = `- PRD: ${path.relative(path.dirname(epicsPath), outputPath).replace(/\\/g, '/')}`;
    if (!epics.includes(refLine)) {
      const header = epics.trim() === '' ? '# Epics\n\n' : '';
      const newContent = `${epics.trim()}\n${header}${refLine}\n`;
      await fs.writeFile(epicsPath, newContent, 'utf8');
    }
  } catch (e) {
    // non-fatal
  }

  return { outputPath, epicsPath };
}

module.exports = { createPrd };
