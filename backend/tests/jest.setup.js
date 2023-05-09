import failOnConsole from 'jest-fail-on-console';
import { jest } from '@jest/globals';

global.jest = jest;
failOnConsole({
    shouldFailOnLog: true,
});
