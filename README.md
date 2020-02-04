# Проверка подписи параметов запуска

# middleware для adonis

```js
'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Config = use("Config")
const {getStartParamsFromUrl,createStartParamsFromUrl} = require("@happysanta/nodejs-sign-checker")

class CheckStartParams {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({request, response}, next) {
    const sign = (request.header('X-Vk-Sign')||"").toString()
    const startParams = getStartParamsFromUrl(sign, Config.get("app.appSecret"))
    if (startParams) {
      request.startParams = startParams
      await next()
    } else {
      if (process.env.NODE_ENV !== 'production' && Config.get('app.skipSignCheck')) {
        request.startParams = createStartParamsFromUrl(sign)
        await next()
      } else {
        response.status(403).json({error: {code: 403, message: "No auth header or broken"}})
      }
    }
  }
}

module.exports = CheckStartParams
```