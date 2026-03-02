const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { createPrd } = require('../tools/lib/create-prd');

describe('create-prd', () => {
  const outDir = path.join(__dirname, 'tmp-output');
  const outPrd = path.join(outDir, 'docs', 'prd-test.md');
  const epics = path.join(outDir, 'planning', 'epics.md');

  beforeAll(async () => {
    await fs.remove(outDir);
    await fs.ensureDir(outDir);
  });

  afterAll(async () => {
    await fs.remove(outDir);
  });

  test('generates PRD and updates epics', async () => {
    const res = await createPrd({ outputPath: outPrd, epicsPath: epics, project_name: 'TestProj', user_name: 'Tester', overwrite: true, root: process.cwd() });
    expect(await fs.pathExists(res.outputPath)).toBe(true);
    const txt = await fs.readFile(res.outputPath, 'utf8');
    expect(txt).toMatch(/workflowType:\s*'prd'/);
    expect(txt).toMatch(/TestProj/);

    expect(await fs.pathExists(res.epicsPath)).toBe(true);
    const e = await fs.readFile(res.epicsPath, 'utf8');
    expect(e).toMatch(/PRD:/);
  });
});
