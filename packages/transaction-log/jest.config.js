const path = require('path')

module.exports = {
  rootDir: 'src',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    'single-spa-react/parcel': 'single-spa-react/lib/cjs/parcel.cjs',
    '^@jembi/openhim-core-api$': path.resolve(
      __dirname,
      '../openhim-core-api/src/jembi-openhim-core-api.ts'
    )
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom']
}
