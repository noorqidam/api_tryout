'use strict';
module.exports = (sequelize, DataTypes) => {
  const child_menu = sequelize.define('utbk_child_menu', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    icon: DataTypes.STRING,
    master_menu_id: DataTypes.INTEGER
  }, {});
  child_menu.associate = function(models) {
    // associations can be defined here
  };
  return child_menu;
};