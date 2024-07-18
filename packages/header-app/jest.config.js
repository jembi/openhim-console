module.exports = {
  rootDir: 'src',
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '__mocks__'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest'
  },

  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    'single-spa-react/parcel': 'single-spa-react/lib/cjs/parcel.cjs'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom']
}
