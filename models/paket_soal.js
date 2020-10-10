'use strict';
module.exports = (sequelize, DataTypes) => {
  const paket_soal = sequelize.define('paket_soal', {
    name: DataTypes.STRING,
    theme_id: DataTypes.INTEGER,
    trial: DataTypes.BOOLEAN,
    model_soal_id: DataTypes.INTEGER,
    is_timer: DataTypes.BOOLEAN,
    is_publish: DataTypes.BOOLEAN,
    created_by:DataTypes.INTEGER
  }, {
    
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  paket_soal.associate = function(models) {
    // associations can be defined here
    //paket_soal.belongsTo(models.theme, { as: 'theme', foreignKey: 'theme_id' , targetKey:'id'});
    //paket_soal.hasMany(models.soal , { as:'soals', foreignKey: 'paket_soal_id'});
  };
  return paket_soal;
};