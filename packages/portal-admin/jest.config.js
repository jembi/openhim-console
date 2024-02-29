module.exports = {
  rootDir: 'src',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest'
  },
  moduleDirectories: ['node_modules', '__mocks__'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    'single-spa-react/parcel': 'single-spa-react/lib/cjs/parcel.cjs'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom']
}
