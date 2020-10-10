'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
moment.locale('id')
const TrashUjianSchema = new Schema(
  {
    _id: { type : String},
    judul_ujian: { type: String, index: true },
    ujian_slug: { type: String },
    ujian_banner: { type: String },
    type_ujian: { type: String },
    is_premium : { type : Boolean  },
    is_private : { type : Boolean,index: true},
    category_ujian : { type: String,index: true },
    penyelenggara :  { type : String,index: true},
    start_date : { type : Date},
    durasi_soal: { type : Number},
    end_times : { type : String},
    end_date : { type : Date},
    times : { type : String},
    type_start: { type : String},
    description : { type : String},
    waktu_pengerjaan : { type : String},
    publish: { type : Boolean},
    metode_penilaian: { type: String},
    createdBy: {type: String, required: true},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: moment().format('YYYY-MM-DD')
    }
  }
);

const TrashUjian = mongoose.model('TrashUjian', TrashUjianSchema);
module.exports =  { TrashUjian }