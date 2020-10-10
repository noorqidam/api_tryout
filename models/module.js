'use strict';
module.exports = (sequelize, DataTypes) => {
  var modules = sequelize.define('module', {
    name: DataTypes.STRING,
    module_slug : DataTypes.STRING,
    image: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
    status_delete: DataTypes.BOOLEAN,
    publisher_id: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    amount_like: DataTypes.INTEGER,
    amount_finish: DataTypes.INTEGER,
    module_category_id: DataTypes.INTEGER,
    is_publish: DataTypes.BOOLEAN,
    //module_education:DataTypes.STRING,
    kelas_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    //meta_desctiption: DataTypes.TEXT,
    total_paket_soal: DataTypes.INTEGER,
    code_number: DataTypes.STRING,
    module_type : DataTypes.STRING,
    publisher: DataTypes.STRING
  }, {
    defaultScope: {
      where: {
        //status_delete: false,
        //is_publish:false
      },
      attributes:['id','name','module_slug','image','price','description','total_paket_soal','code_number','kelas_id','publisher_id','module_category_id','module_type','publisher','created_at','updated_at'],
      
    },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  modules.associate = function(models) {
    
    modules.belongsTo(models.module_category, { as: 'module_categories', foreignKey: 'module_category_id' ,targetKey:'id'}); 
    modules.belongsTo(models.kelas, { as: 'kelas', foreignKey: 'kelas_id' ,targetKey:'id'}); 
    modules.belongsTo(models.publisher, { as: 'publishers', foreignKey: 'publisher_id' , targetKey:'id'}); 
    modules.hasMany(models.module_author , { foreignKey: 'module_id'});
  };
  return modules;
};