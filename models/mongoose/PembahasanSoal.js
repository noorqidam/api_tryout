'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PembahasanSoalSchema = new Schema(
  {
    soal_id: { type: Number},
    pembahasan_text:{ type: String },
    pembahasan_image:{ type: String },
    pembahasan_video: { type: String },
    publish: { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  }
);

const PembahasanSoal = mongoose.model('PembahasanSoal', PembahasanSoalSchema);
module.exports =  { PembahasanSoal }