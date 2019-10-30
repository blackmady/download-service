const router = require('koa-router')();
const DB =require('./db')
// const db
//自定义controler
const ctrls={

}

class Plan{
  constructor(ctx,next){
    this.ctx=ctx
    this.next=next
    this.params=ctx.params
    this.url=ctx.url
    this.handle()
  }
  db(object){
    return new DB(object)
  }
  handle(){
    const oprate=this.params.oprate
    const object=this.params.object
    const data=this.ctx.req.body
    this.dbTable=this.db(object)
    let r=this[`_${oprate}`](data)
    this.ctx.body=r
  }

  // 列表
  async _list(data){
    let list=await this.dbTable.list()
    return list
  }
  // 单条记录
  async _get(data){

  }
  // 新增条目
  async _post(data){
    return await this.dbTable.add({
      filename:'xxxx.jpg'
    })
  }
  // 更新条目
  async _put(data){
    
  }
  // 更新条目局部
  async _patch(data){

  }
  // 删除条目
  async _delete(data){

  }
}
// 总控制
const noneCtrl= async (ctx,next)=>{
  let plan=new Plan(ctx,next)
  plan._post()
}

router.all('/api/:oprate/:object',noneCtrl)

module.exports = router