'use strict';
module.exports = (sequelize, DataTypes) => {
  const publisher = sequelize.define('publisher', {
    name: DataTypes.STRING,
    slug_name: DataTypes.STRING,
    address: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    deleted_by: DataTypes.INTEGER,
    status_delete: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    code_number: DataTypes.STRING,
    phone: DataTypes.STRING,
    id_card: DataTypes.STRING,
    id_card_number: DataTypes.STRING,
    id_card_img: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    deed: DataTypes.STRING,
    deed_image: DataTypes.STRING,
    decree: DataTypes.STRING,
    decree_image: DataTypes.STRING,
    city_id: DataTypes.INTEGER,
    skdp_number: DataTypes.STRING,
    skdp_image: DataTypes.STRING,
    npwp_number: DataTypes.STRING,
    npwp_image: DataTypes.STRING,
    certificate_domicile: DataTypes.STRING,
    certificate_domicile_img: DataTypes.STRING,
    description: DataTypes.TEXT,
    business_entity_id: DataTypes.INTEGER,
    business_entity: DataTypes.STRING,
    email: DataTypes.STRING,
    subtitle_name: DataTypes.STRING,
    logo: DataTypes.STRING,
    site_url: DataTypes.STRING,
    account_facebook: DataTypes.STRING,
    account_twitter: DataTypes.STRING,
    account_linkedin: DataTypes.STRING,
    account_instagram: DataTypes.STRING,
    account_youtube:DataTypes.STRING
  }, {
    // defaultScope: {
    //   attributes :['id','name','address','email','phone']
    // },
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  publisher.associate = function(models) {
    // associations can be defined here
  };
  return publisher;
};