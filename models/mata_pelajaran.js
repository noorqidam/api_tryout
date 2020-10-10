'use strict';
module.exports = (sequelize, DataTypes) => {
  const mata_pelajaran = sequelize.define('mata_pelajaran', {
    name: DataTypes.STRING,
    status_delete: DataTypes.BOOLEAN
  }, {
    defaultScope: {
      attributes:['id','name'],
      where : {
        status_delete : false
      }
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  mata_pelajaran.associate = function(models) {
    // associations can be defined here
  };
  return mata_pelajaran;
};