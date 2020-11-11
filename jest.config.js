module.exports = {
  projects: [
    {
      // https://github.com/formium/tsdx/blob/master/src/createJestConfig.ts
      displayName: 'unitTest',
      transform: {
        '.(ts|tsx)$': require.resolve('ts-jest/dist'),
        '.(js|jsx)$': require.resolve('babel-jest'), // jest's default
      },
      transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
      testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
      testURL: 'http://localhost',
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
      ],
    },
    {
      name: 'screenshotTest',
      testEnvironment: 'node',
      globalSetup: 'react-screenshot-test/global-setup',
      globalTeardown: 'react-screenshot-test/global-teardown',
      testMatch: ['<rootDir>/**/*.(screenshot).{ts,tsx,js,jsx}'],
      transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
      transform: {
        '.(ts|tsx)$': require.resolve('ts-jest/dist'),
        '.(js|jsx)$': require.resolve('babel-jest'), // jest's default
        '^.+\\.module\\.css$': require.resolve('react-screenshot-test/css-modules-transform'),
        '^.+\\.css$': 'react-screenshot-test/css-transform',
        '^.+\\.scss$': 'react-screenshot-test/sass-transform',
        '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          'react-screenshot-test/asset-transform',
      },
    },
  ],
};
