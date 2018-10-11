/* For build */
import { uglify } from 'rollup-plugin-uglify'

const baseConf = require('./rollup.config.base')

const conf = entry => Object.assign({}, baseConf, {
  input: entry.filename,
  output: entry.formats.map(format => ({
    file: `./lib/${format}/${entry.name}.js`,
    format,
    name: 'VueImgTag',
  })),
  external: entry.external ? ['@livelybone/simple-observer', '@livelybone/scroll-get', 'base64-blob'] : [],
  plugins: baseConf.plugins.concat([(entry.needUglify !== false && uglify())]),
})

export default [
  {
    name: 'index',
    filename: './src/Index.vue',
    formats: ['es'],
    needUglify: false,
    external: true,
  },
  { name: 'index', filename: './src/Index.vue', formats: ['umd'] },
].map(conf)
