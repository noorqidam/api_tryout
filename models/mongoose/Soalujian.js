'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
moment.locale('id')
const JawabanSchema = new Schema(
  {
    soal_id : { type: Schema.Types.ObjectId, ref: 'Banksoal' },
    jawaban_text: {type: String },
    jawaban_image: {type: String },
    benar: {type: Boolean, required: true},
    point: {type: Number}
  }
);
const BankSoalSchema = new Schema(
  {
    soal_text: { type: String },
    soal_image: { type:String },
    soal_video: { type: String },
    category_id: { type:String },
    matpel_id: { type:String },
    publisher_id:{ type:String },
    type_soal:{ type: String ,required: true },
    publish: { type:Boolean },
    deleted: { type:Boolean },
    jawabans: [JawabanSchema]
  }
);
const SoalUjianSchema = new Schema(
  {
    ujian_id : { type: Schema.Types.ObjectId, ref: 'Ujian' },
    sesi_ujian : { type : String , required : true}, // nama sesi ujian
    change_jawaban: { type: Boolean , default : false}, /** optional for setting  */
    soals :[BankSoalSchema],
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }
);

const SoalUjian = mongoose.model('SoalUjian', SoalUjianSchema);
module.exports =  { SoalUjian }