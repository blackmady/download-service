const path = require('path');
const Koa = require('koa')
const consola = require('consola')
const router = require('./router')
const bodyParser = require('koa-bodyparser')
const helmet = require("koa-helmet")
const serve = require('koa-static');
// const logger = require('koa-logger')
// const compress = require('koa-compress')
// const jwt=require('koa-jwt')
// const { koaJwtSecret } = require('jwks-rsa')
// const serve = require('koa-session');

const app = new Koa()

app
  // .use(logger())
  .use(serve(path.join(__dirname , '../dist/')))
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
