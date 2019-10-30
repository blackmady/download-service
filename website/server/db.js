const fs=require('fs')
const SqliteDB = require('./sqlite.js').SqliteDB;
const file = "data.db";
const db = new SqliteDB(file);
fs.exists(file,exists=>{
  if(exists)return;
  const createFilesTableSql = `CREATE TABLE "files" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" varchar,
    "createAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;
  sqliteDB.createTable(createFilesTableSql);
})

class DB{
  constructor(table){
    this.table=table
  }
  add(data){
    const keys=Object.keys(data)
    const values=Object.values(data)
    const nv=values.map(item=>typeof item==='string'?`"${item}"`:item)
    const sql=`insert into ${this.table} (${keys.join()}) values(${nv})`
    return this.exec(sql)
  }
  list(){
    const sql=`select * from ${this.table}`
    return this.exec(sql)
  }
  update(){
    const sql = `update ${this.table} set level = 2 where level = 1 and column = 10 and row = 10`
    return this.exec(sql)
  }
  delete(){
    
  }
  exec(sql){
    return new Promise((resolve,reject)=>{
      db.queryData(sql, resolve, function(e){
        console.error(e);
        reject(e)
      })
    })
  }
}
module.exports=DB