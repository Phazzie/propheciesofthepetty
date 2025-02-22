import fs from 'fs';
import path from 'path';
``
interface TestStatus {
  coverage: number;
  failedTests: string[];
  flakyTests: string[];
  lastRun: Date;
}

// Generate status update for the roadmap
function generateStatusUpdate(suite: string, report: any): string {
    return `- Suite: ${suite}
- Last Run: ${report.timestamp}
- Results: ${report.results.length} tests run`;
}

interface BlockerUpdate {
  type: 'test' | 'performance' | 'type';
  description: string;
  impact: string;
}

export class TestTracker {
  private static STATUS_FILE = path.join(__dirname, '../../docs/TEST_STATUS.md');
  private static BLOCKERS_FILE = path.join(__dirname, '../../docs/BLOCKERS.md');

  static updateTestStatus(results: TestStatus) {
    const status = this.generateTestStatus(results);
    fs.writeFileSync(this.STATUS_FILE, status);

    if (results.failedTests.length > 0) {
      this.updateBlockers(this.generateBlockerUpdates(results.failedTests));
    }
  }

  private static generateTestStatus(results: TestStatus): string {
    return `# Test Status Report
Last Updated: ${new Date().toISOString().split('T')[0]}

## Current Coverage: ${results.coverage}%

## Failed Tests
${results.failedTests.map(test => `- ${test}`).join('\n')}

## Flaky Tests
${results.flakyTests.map(test => `- ${test}`).join('\n')}`;
  }

  private static generateBlockerUpdates(failedTests: string[]): BlockerUpdate[] {
    return failedTests.map(test => ({
      type: 'test',
      description: `Test failure: ${test}`,
      impact: 'Blocking test suite progression'
    }));
  }

  private static updateBlockers(updates: BlockerUpdate[]) {
    if (!fs.existsSync(this.BLOCKERS_FILE)) {
      this.initializeBlockersFile();
    }

    const content = fs.readFileSync(this.BLOCKERS_FILE, 'utf8');
    const updatedContent = this.insertUpdates(content, updates);
    fs.writeFileSync(this.BLOCKERS_FILE, updatedContent);
  }

  private static initializeBlockersFile() {
    const initial = `# Current Blockers
Last Updated: ${new Date().toISOString().split('T')[0]}

## Technical Blockers

`;
    fs.writeFileSync(this.BLOCKERS_FILE, initial);
  }

  private static insertUpdates(content: string, updates: BlockerUpdate[]): string {
    const updateText = updates.map(update => `### ${update.type.toUpperCase()}
- Issue: ${update.description}
- Impact: ${update.impact}
- Status: Active blocker
`).join('\n');

    const [header, ...rest] = content.split('## Technical Blockers');
    return `${header}## Technical Blockers\n\n${updateText}\n${rest.join('')}`;
  }
}

// Track test results and generate reports
export function trackTestResults(testSuite: string) {
    return {
        beforeAll() {
            console.log(`Running ${testSuite} test suite`);
        },
        
        afterEach(test: any) {
            const result = {
                name: test.name,
                status: test.state,
                duration: test.duration,
                errors: test.errors
            };
            updateTestLog(testSuite, result);
        },
        
        afterAll() {
            generateTestReport(testSuite);
        }
    };
}

// Update FAILING_TESTS_LOG.md with results
function updateTestLog(suite: string, result: any) {
    const logPath = './FAILING_TESTS_LOG.md';
    const timestamp = new Date().toISOString();
    
    let content = fs.readFileSync(logPath, 'utf8');
    const marker = '## Recent Failures';
    const [before, after] = content.split(marker);
    
    const update = `${before}${marker}\nLast updated: ${timestamp}\n\n### ${suite}\n- ${result.status === 'fail' ? '❌' : '✓'} ${result.name}\n${after}`;
    
    fs.writeFileSync(logPath, update);
}

// Generate comprehensive test report
function generateTestReport(suite: string) {
    const reportPath = './test-report.json';
    const report = {
        suite,
        timestamp: new Date().toISOString(),
        results: []
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Update project roadmap with test status
    updateRoadmap(suite, report);
}

// Keep project roadmap in sync with test status
function updateRoadmap(suite: string, report: any) {
    const roadmapPath = './project_roadmap.md';
    const statusMarker = `### ${suite}`;
    let content = fs.readFileSync(roadmapPath, 'utf8');
    if (content.includes(statusMarker)) {
        const [before, section] = content.split(statusMarker);
        const [_, after] = section.split('\n\n');
        content = `${before}${statusMarker}\n${generateStatusUpdate(suite, report)}\n\n${after}`;
    } else {
        const [before, after] = content.split('## Technical Blockers');
        content = `${before}## Technical Blockers\n\n${statusMarker}\n${generateStatusUpdate(suite, report)}\n\n${after}`;
    }
    fs.writeFileSync(roadmapPath, content);
    }
