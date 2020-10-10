'use strict';
module.exports = (sequelize, DataTypes) => {
  var pilihan_jawaban_soal = sequelize.define('pilihan_jawaban_soal', {
    soal_id: DataTypes.INTEGER,
    isi: DataTypes.TEXT,
    bobot: DataTypes.INTEGER,
    gambar: DataTypes.STRING,
    suara: DataTypes.STRING,
    video: DataTypes.STRING,
    is_correct: DataTypes.BOOLEAN,
    no_urut: DataTypes.INTEGER
  }, {
    defaultScope: {
      attributes:['soal_id','id','isi','bobot','gambar','suara','video','is_correct','no_urut']
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  pilihan_jawaban_soal.associate = function(models) {
    // associations can be defined here
  };
  return pilihan_jawaban_soal;
};