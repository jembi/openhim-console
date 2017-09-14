const { FuseBox, CSSPlugin, CSSResourcePlugin, WebIndexPlugin, HTMLPlugin, BabelPlugin, JSONPlugin, QuantumPlugin, CopyPlugin } = require('fuse-box')

const isProduction = /prod/.test(process.env.NODE_ENV || 'dev')

const fuse = new FuseBox({
  homeDir: 'app/',
  output: 'dist/$name.js',
  target: 'browser',
  shim: {
    jquery: {
      source: 'node_modules/jquery/dist/jquery.js',
      exports: '$'
    },
    'morris.js': {
      source: 'node_modules/morris.js/morris.js',
      exports: 'Morris'
    }
  },
  sourceMaps: { inline: false, sourceRoot: 'app' },
  hash: isProduction,
  cache: !isProduction,
  plugins: [
    [CSSResourcePlugin({
      resolve: file => `/css-resources/${file}`,
      dist: `${__dirname}/dist/css-resources/`
    }), CSSPlugin()],
    JSONPlugin(),
    BabelPlugin(),
    HTMLPlugin({ useDefault: false }),
    WebIndexPlugin({ template: 'app/template.html' }),
    isProduction && QuantumPlugin({ uglify: true, treeshake: true })
  ]
})

if (!isProduction) {
  fuse.dev({ port: 9001 })
}

const appBundle = fuse.bundle('app')
  .instructions('>scripts/index.js')

if (!isProduction) {
  appBundle.watch()
}

fuse.run()
