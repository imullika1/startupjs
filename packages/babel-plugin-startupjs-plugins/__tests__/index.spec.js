const { readFileSync } = require('fs')
const { join } = require('path')
const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

const FIXTURES_PATH = join(__dirname, '../fixtures')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    root: FIXTURES_PATH
  },
  babelOptions: {
    filename: join(FIXTURES_PATH, './node_modules/config/index.js')
  },
  tests: {
    'Ignores files without a magic import': /* js */`
      import config from './startupjs.config.js'
      console.log(config)
    `,
    'Processes files with a magic import': /* js */`
      import { registry } from 'startupjs/registry'
      import config from './startupjs.config.magic.js'
      import dummy from '@dummy/dummy'

      registry.init(config)

      const x = 'xxx'
      dummy(x)

      export default () => {}
    `,
    'Test sample file from fixtures which loads config':
      readFileSync(join(FIXTURES_PATH, './node_modules/config/index.js'), 'utf8')
  }
})
