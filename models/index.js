const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = {
    database: 'cases',
    username: 'caseuser',
    password: 's1rin3',
    host: 'DESKTOP-O04IG8V',
    dialect: 'mssql', // Or other dialects
};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const models = {};

// Load models dynamically
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.js') && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Define associations (example)
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Example relationships
/* PUT YOUR RELATIONSHIPS TABLES
models.User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' });
models.Post.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
*/
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;

