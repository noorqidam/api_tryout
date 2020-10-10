'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NilaiUjianSchema = new Schema(
  {
    ujian_id : { type: Schema.Types.ObjectId, ref: 'Ujian', required: true },
    sesi_id : { type : Schema.Types.ObjectId, ref: 'Soalujian', required: true },
    profile_id: { type: String, ref: 'Profile' },
    user_id: { type: String, required: true },
    judul_ujian: { type: String },
    sesi_ujian: { type: String },
    school: { type: String },
    kelas: { type: String },
    sub_kelas: { type: String },
    photo: { type: String },
    email: { type: String },
    name: { type: String },
    creadtedBy: { type: String, required: true },
    nilai_objective: { type: String },
    nilai_esay: { type: String },
    nilai_akhir: { type: Number, required: true },
    catatan: { type: String },
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);



const NilaiUjian = mongoose.model('NilaiUjian', NilaiUjianSchema);
module.exports =  { NilaiUjian }