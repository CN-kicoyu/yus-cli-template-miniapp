'use strict'
require('shelljs/global')
require('./check-versions')()

const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('./yus.config')
const webpackConfig = require('./webpack.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

rm('-rf', config.build.assetsRoot)
mkdir(config.build.assetsRoot)

const fileSrc = fs.readdirSync(resolve('src/pages')).map((i) => `pages/${i}/${i}`)
let data = fs.readFileSync(resolve('src/app.json'))
data = JSON.parse(data.toString())
data.pages = fileSrc

let entry = []
const yus = () => _.reduce(data.pages, (en, i) => {
  return entry.push(resolve(`src/${i}.yus`))
}, {})
yus() && entry.push(resolve('src/app.js'))
webpackConfig.entry = {'app': entry}

fs.writeFile(resolve('src/app.json'), JSON.stringify(data), err => {
  if (err) return console.error(err)
  fs.writeFile(`${config.build.assetsRoot}/app.json`, JSON.stringify(data), err => {
    if (err) return console.error(err)
  })
})

const compiler = webpack(webpackConfig)
compiler.watch({
  aggregateTimeout: 300,
  poll: true
}, (err, stats) => {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('  Build complete.\n'))
})