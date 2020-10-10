'use strict';
module.exports = (sequelize, DataTypes) => {
  const utbk_category_soal = sequelize.define('utbk_category_soal', {
    category_name: DataTypes.STRING,
    publish: DataTypes.BOOLEAN
  }, {});
  utbk_category_soal.associate = function(models) {
    // associations can be defined here
  };
  return utbk_category_soal;
};