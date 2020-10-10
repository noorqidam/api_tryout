'use strict';
module.exports = (sequelize, DataTypes) => {
  const utbk_matapelajaran = sequelize.define('utbk_matapelajaran', {
    subject_name: DataTypes.STRING,
    category_name: DataTypes.STRING,
    publish: DataTypes.BOOLEAN
  }, {});
  utbk_matapelajaran.associate = function(models) {
    // associations can be defined here
  };
  return utbk_matapelajaran;
};