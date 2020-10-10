'use strict';
module.exports = (sequelize, DataTypes) => {
  const profile = sequelize.define('profile', {
    user_id: DataTypes.STRING, 
    address: DataTypes.TEXT,
    fullname : DataTypes.STRING,
    tanggal_lahir: DataTypes.INTEGER,
    bulan_lahir: DataTypes.CHAR,
    tahun_lahir: DataTypes.INTEGER,
    jenis_kelamin : DataTypes.ENUM('LAKI-LAKI','PEREMPUAN'),
    status : DataTypes.STRING,
    kelas : DataTypes.STRING,
    nama_sekolah : DataTypes.STRING,
    nama_orangtua : DataTypes.STRING,
    province_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    district_id: DataTypes.INTEGER,
    profile: DataTypes.STRING,
    zip_code: DataTypes.CHAR
  }, {});
  profile.associate = function(models) {
    // associations can be defined here
    // profile.belongsTo(models.province ,{ as :'province', foreignKey:'province_id', targetKey:'id'});
    // profile.belongsTo(models.city ,{ as :'city', foreignKey:'city_id', targetKey:'id'});
    // profile.belongsTo(models.district ,{ as :'district', foreignKey:'district_id', targetKey:'id'});
  };
  return profile;
};