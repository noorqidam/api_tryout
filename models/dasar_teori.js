'use strict';
module.exports = (sequelize, DataTypes) => {
  const dasar_teori = sequelize.define('dasar_teori', {
    title: DataTypes.STRING,
    slug_title: DataTypes.STRING,
    teori: DataTypes.TEXT,
    module_id: DataTypes.INTEGER,
    theme_id : DataTypes.INTEGER,
    publish: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    trial : DataTypes.BOOLEAN
  }, {
    defaultScope: {
      where : {
        deleted : false
      }
    },
  });
  dasar_teori.associate = function(models) {
    // associations can be defined here
    // dasar_teori.belongsTo(models.module, { as: 'modules', foreignKey: 'module_id' , targetKey:'id'});
    // dasar_teori.belongsTo(models.theme, { as: 'thema', foreignKey: 'theme_id' , targetKey:'id'});
  };
  return dasar_teori;
};