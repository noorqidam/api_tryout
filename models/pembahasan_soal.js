'use strict';
module.exports = (sequelize, DataTypes) => {
  var pembahasan_soal = sequelize.define('pembahasan_soal', {
    soal_id: DataTypes.INTEGER,
    isi: DataTypes.TEXT,
    gambar: DataTypes.STRING,
    video: DataTypes.STRING,
    is_show: DataTypes.BOOLEAN
  }, {
    defaultScope: {
      // where : {
      //   is_show: true
      // },
      attributes:['soal_id','id','isi','gambar','suara','video','is_show']
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  pembahasan_soal.associate = function(models) {
    // associations can be defined here
  };
  return pembahasan_soal;
};