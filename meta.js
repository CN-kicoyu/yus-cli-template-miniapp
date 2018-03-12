const path = require('path')
const fs = require('fs')
const {
  sortDependencies,
  installDependencies,
  printMessage,
} = require('./utils')

module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Project name'
    },
    miniapp: {
      type: 'list',
      message: 'which frame want to set up mini-program?',
      choices: [
        {
          name: 'wechat',
          value: 'wechat',
          short: 'wechat'
        },
        {
          name: 'alipay',
          value: 'alipay',
          short: 'alipay'
        }
      ]
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Mini-Program project'
    },
    author: {
      type: 'string',
      message: 'Author',
    },
    autoInstall: {
      type: 'list',
      message: 'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm'
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        }
      ]
    }
  },
  filters: {
    'src/project.config.json': "miniapp === 'wechat'",
    'src/.eslintrc': "miniapp === 'alipay'"
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  }
}