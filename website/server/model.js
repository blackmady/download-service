const {sequelize,db} =require('./conn')
const Sequelize =require('sequelize')
const shortid =require('shortid')
const files = sequelize.define('files', {
  // 属性
  sid:{
    type:Sequelize.STRING,
    defaultValue:shortid.generate(),
  },
  size:{
    type:Sequelize.NUMBER
  },
  ext:{
    type:Sequelize.STRING
  },
  //状态0：未下载完成，1：已下载完成，2：下载失败
  status:{
    type:Sequelize.INTEGER,
    defaultValue:0
  },
  percent:{
    type:Sequelize.FLOAT,
    defaultValue:0
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, {
  timestamps: true,
});

// db.sync(files)

module.exports = {
  files
}