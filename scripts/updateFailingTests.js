const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const junitPath = path.resolve(process.cwd(), 'coverage', 'junit.xml');
const logPath = path.resolve(process.cwd(), 'FAILING_TESTS_LOG.md');

if (!fs.existsSync(junitPath)) {
  console.error('junit.xml not found in coverage directory.');
  process.exit(1);
}

const xmlData = fs.readFileSync(junitPath, 'utf8');

xml2js.parseString(xmlData, (err, result) => {
  if (err) {
    console.error('Error parsing junit.xml:', err);
    process.exit(1);
  }
  
  // Extract test failures from junit.xml
  const failures = [];
  const testSuites = result.testsuites && result.testsuites.testsuite ? result.testsuites.testsuite : [];
  
  testSuites.forEach((suite) => {
    if (suite.testcase) {
      suite.testcase.forEach((testcase) => {
        if (testcase.failure) {
          const testName = testcase.$.name;
          const message = testcase.failure[0]._ || testcase.failure[0].$.message || 'No failure message provided';
          failures.push(`Test: ${testName}\nMessage: ${message}\n`);
        }
      });
    }
  });

  let logContent = '# Failing Tests Log\n\n';
  if (failures.length > 0) {
    logContent += failures.join('\n');
  } else {
    logContent += 'All tests passed!';
  }

  fs.writeFileSync(logPath, logContent, 'utf8');
  console.log('FAILING_TESTS_LOG.md updated successfully.');
});
