'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    name: { type: String },
    user_id: { type: String ,required: true},
    email:{ type: String},
    school: { type: String },
    kelas: { type: String},
    sub_kelas : { type: String},
    photo:{ type: String },
    jenis_kelamin : { type: String},
    publisher_id: { type: String },
    createdAt: { type: Date , default : new Date() },
    updatedAt: { type: Date , default : new Date() },
  }
);


const Profile = mongoose.model('Profile', ProfileSchema)
module.exports =  { Profile }