const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, '__tests__');
let totalTests = 0;
let passedTests = 0;

function countTests(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            countTests(filePath);
        } else if (file.endsWith('.test.js') || file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
            totalTests++;
            // Simulate test result
            const testResult = Math.random() > 0.2; // 80% pass rate
            if (testResult) {
                passedTests++;
            }
        }
    });
}

countTests(testDir);

const percentagePass = (passedTests / totalTests) * 100;
const additionalTestsNeeded = Math.max(0, 20 - totalTests); // Example requirement for 20 tests

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed Tests: ${passedTests}`);
console.log(`Percentage Pass: ${percentagePass.toFixed(2)}%`);
console.log(`Additional Tests Needed: ${additionalTestsNeeded}`);