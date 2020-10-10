'use strict';
module.exports = (sequelize, DataTypes) => {
  const theme = sequelize.define('theme', {
    theme_name: DataTypes.STRING,
    mata_pelajaran_id: DataTypes.INTEGER,
    semester: DataTypes.STRING,
    module_id: DataTypes.INTEGER,
    created_by:DataTypes.INTEGER,
    is_publish: DataTypes.BOOLEAN,
    trial : DataTypes.BOOLEAN
  }, {
    defaultScope: {
      attributes:['id','theme_name','module_id','trial','is_publish'],
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  theme.associate = function(models) {
    // associations can be defined here
    theme.hasMany(models.paket_soal , { as : 'paket_soal' , foreignKey :'theme_id'});
    theme.belongsTo(models.mata_pelajaran ,{ as :'mata_pelajarans', foreignKey:'mata_pelajaran_id', targetKey:'id'});
    //theme.hasMany(models.dasar_teori , { as : 'teori' , foreignKey :'theme_id'});

  };
  return theme;
};