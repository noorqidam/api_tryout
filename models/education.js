'use strict';
module.exports = (sequelize, DataTypes) => {
  var education = sequelize.define('educations', {
    education_name: DataTypes.STRING,
    status_delete: DataTypes.BOOLEAN
  }, {
    defaultScope: {
      where : {
        status_delete : false
      }
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  education.associate = function(models) {
    // associations can be defined here
  };
  return education;
};