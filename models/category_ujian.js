'use strict';
module.exports = (sequelize, DataTypes) => {
  const category_ujian = sequelize.define('category_ujian', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    publish: DataTypes.BOOLEAN
  }, {});
  category_ujian.associate = function(models) {
    // associations can be defined here
  };
  return category_ujian;
};