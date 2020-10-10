'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_category = sequelize.define('module_category', {
    name: DataTypes.STRING,
    status_delete: DataTypes.BOOLEAN
  }, {
    defaultScope: {
      attributes :['id','name'],
      // where: {
      //   status_delete: false
      // }
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  module_category.associate = function(models) {
    // associations can be defined here
  };
  return module_category;
};