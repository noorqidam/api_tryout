'use strict';
module.exports = (sequelize, DataTypes) => {
  var kelas = sequelize.define('kelas', {
    name: DataTypes.STRING
  }, {
    defaultScope: {
      attributes:['id','name']
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  kelas.associate = function(models) {
    // associations can be defined here
    kelas.belongsTo(models.educations ,{ as :'education', foreignKey: 'education_id' ,targetKey:'id'});
    //modules.belongsTo(models.kelas, { as: 'kelas', }); 
  };
  return kelas;
};