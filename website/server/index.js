const path = require('path');
const Koa = require('koa')
const consola = require('consola')
const router = require('./router')
const bodyParser = require('koa-bodyparser')
const helmet = require("koa-helmet")
const static = require('koa-static');
// const session = require('koa-session');
// const logger = require('koa-logger')
// const compress = require('koa-compress')
// const jwt=require('koa-jwt')
// const { koaJwtSecret } = require('jwks-rsa')

const app = new Koa()

app.keys = ['none'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 3600000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app
  // .use(session(CONFIG, app))
  // .use(logger())
  // .use(static(path.join(__dirname , '../dist/')))
  .use(static(path.join(__dirname , '../upload/')))
  .use(bodyParser())
  .use(helmet())
  .use(router.routes())
  .use(router.allowedMethods())

async function start() {
  const host = process.env.HOST || '0.0.0.0'
  const port = process.env.PORT || 9999

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
