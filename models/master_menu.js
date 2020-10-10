'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_menu = sequelize.define('utbk_master_menu', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    icon: DataTypes.STRING,
    key: DataTypes.STRING,
    urutan: DataTypes.INTEGER
  }, {});
  master_menu.associate = function(models) {
    // associations can be defined here
    master_menu.hasMany(models.mymenu_child, { as: 'children', foreignKey: 'master_menu_id'}); 
  };
  return master_menu;
};