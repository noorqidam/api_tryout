'use strict';
module.exports = (sequelize, DataTypes) => {
  const utbk_banksoal = sequelize.define('utbk_banksoal', {
    _id: DataTypes.STRING,
    soal_text: DataTypes.TEXT,
    soal_image: DataTypes.STRING,
    soal_video: DataTypes.STRING,
    category_id: DataTypes.STRING,
    matpel_id: DataTypes.STRING,
    school_level: DataTypes.STRING,
    publisher_id: DataTypes.INTEGER,
    publish: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN
  }, {});
  utbk_banksoal.associate = function(models) {
    // associations can be defined here
  };
  return utbk_banksoal;
};