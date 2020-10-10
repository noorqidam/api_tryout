'use strict';
module.exports = (sequelize, DataTypes) => {
  const soal = sequelize.define('soal', {
    pertanyaan: DataTypes.STRING,
    bobot: DataTypes.INTEGER,
    gambar: DataTypes.STRING,
    suara: DataTypes.STRING,
    video: DataTypes.STRING,
    is_random: DataTypes.BOOLEAN,
    model_soal_id: DataTypes.INTEGER,
    education_id: DataTypes.INTEGER,
    kelas_id: DataTypes.INTEGER,
    mata_pelajaran_id: DataTypes.INTEGER,
    paket_soal_id: DataTypes.INTEGER,
    theme_id: DataTypes.INTEGER,
    module_id: DataTypes.INTEGER,
    status_delete: DataTypes.BOOLEAN
  }, {
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  soal.associate = function(models) {
    // associations can be defined here
    soal.hasMany(models.pilihan_jawaban_soal, { as: 'jawabans', foreignKey: 'soal_id' ,sourceKey: 'id' });
    soal.belongsTo(models.pembahasan_soal ,{ as :'pembahasan', foreignKey:'id', targetKey:'soal_id'});
    soal.belongsTo(models.module ,{ as :'buku', foreignKey:'module_id', targetKey:'id'});
    soal.belongsTo(models.mata_pelajaran ,{ as :'mata_pelajarans', foreignKey:'mata_pelajaran_id', targetKey:'id'});
    soal.belongsTo(models.educations ,{ as :'level', foreignKey:'education_id', targetKey:'id'});
    soal.belongsTo(models.paket_soal ,{ as :'paketsoal', foreignKey:'paket_soal_id', targetKey:'id'});
    soal.belongsTo(models.theme ,{ as :'theme', foreignKey:'theme_id', targetKey:'id'});
  };
  return soal;
};