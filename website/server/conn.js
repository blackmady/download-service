const Sequelize =require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});



const db = {
  test() {
    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  },
  // 模型同步到数据库
  sync(...models){
    return Promise.all(models.map(model=>{
      model.sync({ force: true })
    }))
  }
}
module.exports={sequelize,db}