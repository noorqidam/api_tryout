'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JawabanQuizSchema = new Schema(
  {
    soal_id : { type: Schema.Types.ObjectId, ref: 'Banksoal' },
    jawaban_text: {type: String },
    jawaban_image: {type: String },
  }
);
const BankSoalQuizSchema = new Schema(
  {
    soal_text: { type: String },
    soal_image: { type:String },
    soal_video: { type: String },
    category_id: { type:String },
    matpel_id: { type:String },
    publisher_id:{ type:String },
    type_soal:{ type: String ,required: true },
    answered: { type:Boolean ,default : false },
    jawabans: [JawabanQuizSchema]
  }
);
const MySoalUjianSchema = new Schema(
  {
    ujian_id : { type: Schema.Types.ObjectId, ref: 'Ujian' },
    soals :[BankSoalQuizSchema],
    email: { type : String },
    user_id: { type : String , required : true},
    profile_id : { type: Schema.Types.ObjectId, ref: 'Profile' },
    sesi_id: { type: Schema.Types.ObjectId, ref: 'SoalUjian' },
    duration: { type: String},
    sesi_ujian: { type: String , required: true},
    ip_address: { type: String},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

const MySoalUjian = mongoose.model('MySoalUjian', MySoalUjianSchema);
module.exports =  { MySoalUjian }