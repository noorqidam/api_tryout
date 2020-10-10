'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JawabanSchema = new Schema(
  {
    _id: { type: String },
    soal_id : { type: Schema.Types.ObjectId, ref: 'Banksoal' },
    jawaban_text: {type: String },
    jawaban_image: {type: String },
    benar: {type: Boolean, required: true},
    point: {type: Number},
    is_verified: { type: Boolean , default: true},
    comments: { type: String},
    reviewer:{type: String}
  }
);
const JawabanUjianSchema = new Schema(
  {
    ujian_id : { type: Schema.Types.ObjectId, ref: 'Ujian' },
    sesi_id : { type : Schema.Types.ObjectId, ref: 'Soalujian'},
    soal_id : { type: Schema.Types.ObjectId, required:true, ref: 'Banksoal' },
    profile_id: { type: Schema.Types.ObjectId, ref: 'Profile'},
    user_id: { type: String, required: true},
    school: { type: String },
    kelas: { type: String},
    sub_kelas: { type: String },
    photo: { type: String },
    email: { type: String },
    name: { type: String },
    type_soal:{ type: String , enum: ['PG', 'ESAY'], default:'PG'},
    jawaban :JawabanSchema,
    ip_address: { type: String},
    date: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    },
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

JawabanUjianSchema.index({ soal_id: 1, user_id: 1 }, { unique: true });

const JawabanUjian = mongoose.model('JawabanUjian', JawabanUjianSchema);
module.exports =  { JawabanUjian }