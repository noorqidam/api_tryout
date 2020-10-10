'use strict';
module.exports = (sequelize, DataTypes) => {
  const report_soal = sequelize.define('report_soal', {
    user_id: DataTypes.STRING,
    paket_soal_id: DataTypes.INTEGER,
    soal_id: DataTypes.INTEGER,
    alasan: DataTypes.STRING,
    tindakan : DataTypes.STRING,
    admin_id : DataTypes.INTEGER,
    status_followup: DataTypes.STRING
  }, {});
  report_soal.associate = function(models) {
    // associations can be defined here
    // report_soal.belongsTo(models.soal, { as: 'soals', foreignKey: 'soal_id' , targetKey:'id'});
    // report_soal.belongsTo(models.paket_soal, { as: 'paket_soal', foreignKey: 'paket_soal_id' , targetKey:'id'});
  };
  return report_soal;
};