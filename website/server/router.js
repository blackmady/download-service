const models = require('./model.js');
const router = require('koa-router')();
const wget = require('node-wget-promise');
const shortid = require('shortid');
const send = require('koa-send');

// const db
//自定义controler
const ctrls = {
  async downloadFile(file, ctx, next) {
    const path = `/upload/${file}`;
    ctx.attachment(path);
    await send(ctx, path);
  },
  async download(data, ctx, next) {
    if (!data.url) return
    const sid = shortid.generate()
    let n = 0
    return new Promise((resolve, reject) => {
      return wget(data.url, {
        onStart(e) {
          models.files.create({
            size: 0,
            ext: '',
            filename: sid,
            sid,
            status: 0
          })
        },
        onProgress(e) {
          resolve({ ...e, sid })
        },
        output: `./upload/${sid}`
      }).then(async e => {
        let size = e.fileSize
        let contentDisposition = e.headers['content-disposition']
        let filename = contentDisposition.split('filename=')[1].replace(/^\"|\"$/g, '')
        filename = filename.split('"')[0]
        let ext = filename.split('.')[1] || '';
        let file = await models.files.findOne({ where: { sid } })
        file.size = size;
        file.ext = ext;
        file.filename = filename;
        file.status = 1
        file.save()
        // resolve(e)
      }).catch(async e => {
        console.log(e)
        let file = await models.files.findOne({ where: { sid } })
        if (file) {
          file.status = 2
          file.save()
        }
        reject(e)
      })
    })
  },
  async percent(data, ctx) {
    let file = await models.files.findOne({ where: { sid } })
    return file
  }
}
function output(data = { code: 0, msg: '', data: '' }) {
  if (data.hasOwnProperty('code') && data.hasOwnProperty('msg') && data.hasOwnProperty('data')) {
    return data
  }
  return { code: 0, msg: '', data }
}
class Plan {
  constructor(ctx, next) {
    this.ctx = ctx
    this.next = next
    this.params = ctx.params
    this.url = ctx.url
  }
  async start() {
    const oprate = this.params.oprate
    const table = this.params.object
    const data = this.ctx.request.body
    this.model = models[table]
    let res = output()
    if (oprate[0] === '_') {
      res = await this[`${oprate}`](data)
    } else if (ctrls[oprate]) {
      res = await ctrls[oprate](data, this.ctx, this.next)
    }
    this.ctx.body = output(res)
    this.next()
  }

  // 列表
  async _list(data) {
    return await this.model.findAll({ raw: true })
  }
  // 单条记录
  async _get(data) {

  }
  // 新增条目
  async _post(data) {
    return await this.model.create({
      filename: 'xxxx.jpg'
    })
  }
  // 更新条目
  async _put(data) {

  }
  // 更新条目局部
  async _patch(data) {

  }
  // 删除条目
  async _delete(data) {

  }
}
// 总控制
const noneCtrl = async (ctx, next) => {
  let plan = new Plan(ctx, next)
  await plan.start()
  next()
}

router.all('/api/:oprate/:object', noneCtrl)
router.post('/api/:oprate', noneCtrl)
router.all('/download/:file', async (ctx, next) =>{
  let file = ctx.params.file
  await ctrls.downloadFile(file, ctx, next)
  next()
})

module.exports = router