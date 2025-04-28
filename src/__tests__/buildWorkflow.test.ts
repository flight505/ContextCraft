import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

describe('GitHub Actions build.yml workflow', () => {
  let workflow: any;

  beforeAll(() => {
    const workflowPath = path.resolve(__dirname, '../../.github/workflows/build.yml');
    const content = fs.readFileSync(workflowPath, 'utf8');
    workflow = yaml.load(content);
  });

  test('should define validate and build_and_release jobs', () => {
    expect(workflow.jobs.validate).toBeDefined();
    expect(workflow.jobs.build_and_release).toBeDefined();
  });

  test('validate job runs on ubuntu-latest', () => {
    expect(workflow.jobs.validate['runs-on']).toBe('ubuntu-latest');
  });

  test('build_and_release matrix only includes macos-latest and windows-latest', () => {
    const matrixOs = workflow.jobs.build_and_release.strategy.matrix.os;
    expect(matrixOs).toEqual(['macos-latest', 'windows-latest']);
  });

  test('build_and_release env includes CXXFLAGS set to --std=c++20', () => {
    const env = workflow.jobs.build_and_release.env;
    expect(env.CXXFLAGS).toBe('--std=c++20');
  });

  test('release step should publish immediately (not draft)', () => {
    const steps = workflow.jobs.build_and_release.steps;
    const releaseStep = steps.find((step: any) => step.uses === 'softprops/action-gh-release@v1');
    expect(releaseStep).toBeDefined();
    expect(releaseStep.with.draft).toBe(false);
  });
}); 