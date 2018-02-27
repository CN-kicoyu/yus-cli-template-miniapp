const path = require('path')

module.exports = {
  build: {
    assetsRoot: path.resolve(__dirname, '../dist'),
    htmlExt: '{{#if_eq miniapp "wechat"}}w{{/if_eq}}{{#if_eq miniapp "alipay"}}a{{/if_eq}}xml',
    cssExt: '{{#if_eq miniapp "wechat"}}wx{{/if_eq}}{{#if_eq miniapp "alipay"}}ac{{/if_eq}}ss',
    jsExt: 'js'
  }
}