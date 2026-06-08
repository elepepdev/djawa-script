export default {
  testEnvironment: 'node',
  transform: {},
  coverageProvider: 'v8',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
  ],
};
