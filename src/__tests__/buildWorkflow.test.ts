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

  test('should define validate, build_mac and build_windows jobs', () => {
    expect(workflow.jobs.validate).toBeDefined();
    expect(workflow.jobs.build_mac).toBeDefined();
    expect(workflow.jobs.build_windows).toBeDefined();
  });

  test('validate job runs on ubuntu-latest', () => {
    expect(workflow.jobs.validate['runs-on']).toBe('ubuntu-latest');
  });

  test('build_mac runs on macos-latest', () => {
    expect(workflow.jobs.build_mac['runs-on']).toBe('macos-latest');
  });

  test('build_windows runs on windows-latest', () => {
    expect(workflow.jobs.build_windows['runs-on']).toBe('windows-latest');
  });

  test('build_mac env includes CXXFLAGS set to --std=c++20', () => {
    const env = workflow.jobs.build_mac.env;
    expect(env.CXXFLAGS).toBe('--std=c++20');
  });

  test('build_windows env includes CXXFLAGS for Windows', () => {
    const env = workflow.jobs.build_windows.env;
    expect(env.CXXFLAGS).toBe('/std:c++20');
  });

  test('release step should publish immediately (not draft)', () => {
    const steps = workflow.jobs.build_mac.steps;
    const releaseStep = steps.find((step: any) => step.uses === 'softprops/action-gh-release@v1');
    expect(releaseStep).toBeDefined();
    expect(releaseStep.with.draft).toBe(false);
  });
}); 