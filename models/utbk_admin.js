'use strict';
const uuid  = require('uuid/v4');
module.exports = (sequelize, DataTypes) => {
  const utbk_admin = sequelize.define('utbk_admin', {
    _id: DataTypes.STRING,
    username: DataTypes.STRING,
    displayname: DataTypes.STRING,
    password: DataTypes.STRING,
    authorized: {
     type: DataTypes.ENUM('EDUTORE','PARTNER'),
     //values :['EDUTORE','PARTNER']
    },
    role:{
      type: DataTypes.ENUM('ADMIN','STAF','AUTHOR'),
      //values :['ADMIN','STAF','AUTHOR']
    },
    suspend: DataTypes.BOOLEAN,
    accountkey: DataTypes.STRING //nama publisher
  }, {});
  utbk_admin.associate = function(models) {
    // associations can be defined here
    utbk_admin.belongsTo(models.utbk_master_menu, { as: 'menus', foreignKey: 'authorized' , targetKey:'key'}); 
  };
  return utbk_admin;
};