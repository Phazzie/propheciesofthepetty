import { helloWorld } from '../helloWorld';

describe('helloWorld function', () => {
    test('should return "Hello, World!"', () => {
        expect(helloWorld()).toBe('Hello, World!');
    });
});