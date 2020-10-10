'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_author = sequelize.define('module_author', {
    module_id: DataTypes.INTEGER,
    author_id: DataTypes.INTEGER
  }, {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  module_author.associate = function(models) {
    // associations can be defined here
    module_author.belongsTo(models.author, { as: 'penulis', foreignKey: 'author_id' , targetKey:'id'}); 
  };
  return module_author;
};