const Sequelize = require('sequelize');
const sequelize = require('../config/connection');
const Model = Sequelize.Model;

class Test extends Model {}
Test.init({
  // attributes
  productName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imagePath: {
    type: Sequelize.TEXT
    // allowNull defaults to true
  },
  description: {
    type: Sequelize.TEXT
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'test'
});

module.exports = Test;
