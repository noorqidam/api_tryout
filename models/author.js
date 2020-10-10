'use strict';
module.exports = (sequelize, DataTypes) => {
  const author = sequelize.define('author', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.CHAR,
    address: DataTypes.TEXT,
    publisher_id: DataTypes.INTEGER,
    status_delete : DataTypes.BOOLEAN
  }, {
    defaultScope: {
      attributes :['id','name','publisher_id'],
      where: {
        status_delete: false
      }
    },
  });
  author.associate = function(models) {
    // associations can be defined here
    //author.belongsTo(models.publisher, { as :'publishers', fore});
  };
  return author;
};