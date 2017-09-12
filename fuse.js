const { FuseBox, CSSPlugin, CSSResourcePlugin, WebIndexPlugin, HTMLPlugin, BabelPlugin, JSONPlugin, QuantumPlugin } = require('fuse-box')

const isProduction = /prod/.test(process.env.NODE_ENV || 'dev')

const fuse = new FuseBox({
  homeDir: 'app/',
  output: 'dist/$name.js',
  target: 'browser',
  sourceMaps: { inline: false, sourceRoot: 'app' },
  hash: isProduction,
  cache: !isProduction,
  plugins: [
    [CSSResourcePlugin(), CSSPlugin()],
    JSONPlugin(),
    BabelPlugin(),
    HTMLPlugin({ useDefault: false }),
    WebIndexPlugin({ template: 'app/template.html' }),
    isProduction && QuantumPlugin({ uglify: true, treeshake: true })
  ]
})

if (!isProduction) {
  fuse.dev({ port: 9000 })
}

const appBundle = fuse.bundle('app')
  .instructions('babel-polyfill + >scripts/index.js')

if (!isProduction) {
  appBundle.hmr().watch()
}

fuse.run()
