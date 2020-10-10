'use strict';
module.exports = (sequelize, DataTypes) => {
  var province = sequelize.define('province', {
    name: DataTypes.STRING
  }, {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  province.associate = function(models) {
    // associations can be defined here
  };
  return province;
};