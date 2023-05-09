// eslint-disable-next-line import/no-unused-modules
export default {
    transform: {},
    testEnvironment: 'jest-environment-node',
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    globalSetup: '<rootDir>/tests/global-setup.js',
    testPathIgnorePatterns: ['/dist/', '/node_modules/'],
    restoreMocks: true,
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
    testTimeout: 10000,
    collectCoverageFrom: ['src/**/*.js', '!tests/**'],
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100,
        },
    },
};
