'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferalRegisterSchema = new Schema(
  {
    referal_code: { type: String, required: true},
    school: { type: String },
    kelas: { type: String},
    sub_kelas: { type: String},
    actived: { type: Boolean, default: false},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

const ReferalRegister = mongoose.model('ReferalRegister', ReferalRegisterSchema);
module.exports =  { ReferalRegister }