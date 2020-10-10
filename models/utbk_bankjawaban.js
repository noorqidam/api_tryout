'use strict';
module.exports = (sequelize, DataTypes) => {
  const utbk_bankjawaban = sequelize.define('utbk_bankjawaban', {
    soal_id: DataTypes.STRING,
    jawaban_text: DataTypes.STRING,
    jawaban_image: DataTypes.STRING,
    benar: DataTypes.BOOLEAN,
    point: DataTypes.DOUBLE
  }, {});
  utbk_bankjawaban.associate = function(models) {
    // associations can be defined here
  };
  return utbk_bankjawaban;
};