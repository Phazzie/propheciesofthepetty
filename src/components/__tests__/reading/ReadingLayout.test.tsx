const assert = require('assert');

test('hello world!', () => {
	assert.strictEqual(1 + 1, 2);
});

test('test count and pass percentage', () => {
	const totalTests = 15;
	const passedTests = 12; // Example value, replace with actual passed tests count
	const failedTests = totalTests - passedTests;
	const passPercentage = (passedTests / totalTests) * 100;

	assert.strictEqual(totalTests, 15);
	assert.strictEqual(passedTests, 12);
	assert.strictEqual(failedTests, 3);
	assert.strictEqual(passPercentage, 80); // Example value, replace with actual calculation
});