'use strict';
module.exports = (sequelize, DataTypes) => {
  const mymenu_child = sequelize.define('mymenu_child', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    icon: DataTypes.STRING,
    mymenu_id: DataTypes.INTEGER
  }, {});
  mymenu_child.associate = function(models) {
    // associations can be defined here
  };
  return mymenu_child;
};