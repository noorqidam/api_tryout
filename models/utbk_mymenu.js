'use strict';
module.exports = (sequelize, DataTypes) => {
  const utbk_mymenu = sequelize.define('utbk_mymenu', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    icon: DataTypes.STRING,
    user_id: DataTypes.STRING,
    urutan: DataTypes.INTEGER
  }, {});
  utbk_mymenu.associate = function(models) {
    // associations can be defined here
    utbk_mymenu.hasMany(models.mymenu_child, { as: 'children', foreignKey: 'mymenu_id'}); 
  };
  return utbk_mymenu;
};