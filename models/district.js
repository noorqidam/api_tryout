'use strict';
module.exports = (sequelize, DataTypes) => {
  var district = sequelize.define('district', {
    name: DataTypes.STRING,
    city_id: DataTypes.INTEGER
  }, {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  district.associate = function(models) {
    // associations can be defined here
  };
  return district;
};