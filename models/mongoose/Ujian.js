'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UjianSchema = new Schema(
  {
    judul_ujian: { type: String, required : true, index: true },
    ujian_slug: { type: String, required : true },
    ujian_banner: { type: String },
    type_ujian: { type: String, required: true},
    is_premium : { type : Boolean , required : true },
    is_private : { type : Boolean , required : true  ,index: true},
    category_ujian : { type: String , required: true ,index: true },
    penyelenggara :  { type : String , required : true ,index: true},
    start_date : { type : Date, required: true},
    durasi_soal: { type : Number , default : 60},
    end_times : { type : String},
    end_date : { type : Date},
    times : { type : String},
    type_start: { type : String},
    description : { type : String},
    price: { type: String },
    waktu_pengerjaan : { type : String},
    publish: { type : Boolean , default : false },
    deleted: { type : Boolean, default: false },
    metode_penilaian: { type: String , required: true},
    createdBy: { type: String , required: true},
    deletedBy: {type: String},
    deletedAt: {type: Date},
    restoredBy: {type: String},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

const Ujian = mongoose.model('Ujian', UjianSchema);
module.exports =  { Ujian }