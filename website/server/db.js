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
// /// insert data.
// const tileData = [[1, 10, 10], [1, 11, 11], [1, 10, 9], [1, 11, 9]];
// const insertTileSql = "insert into tiles(level, column, row) values(?, ?, ?)";
// sqliteDB.insertData(insertTileSql, tileData);
// /// query data.
// const querySql = 'select * from tiles where level = 1 and column >= 10 and column <= 11 and row >= 10 and row <=11';
// sqliteDB.queryData(querySql, dataDeal);
// /// update data.
// const updateSql = 'update tiles set level = 2 where level = 1 and column = 10 and row = 10';
// sqliteDB.executeSql(updateSql);
// /// query data after update.
// querySql = "select * from tiles where level = 2";
// sqliteDB.queryData(querySql, dataDeal);
// sqliteDB.close();
// function dataDeal(objects) {
//   for (let i = 0; i < objects.length; ++i) {
//     console.log(objects[i]);
//   }
// }

class DB{
  constructor(table){
    this.table=table
  }
  add(data){
    let keys=Object.keys(data)
    let values=Object.values(data)
    let nv=values.map(item=>typeof item==='string'?`"${item}"`:item)
    let sql=`insert into ${this.table} (${keys.join()}) values(${nv})`
    return this.exec(sql)
  }
  list(){
    let sql=`select * from ${this.table}`
    return this.exec(sql)
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