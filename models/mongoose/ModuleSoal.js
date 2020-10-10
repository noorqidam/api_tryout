'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JawabanSchema = new Schema(
  {
    soal_id : {type: Number },
    jawaban_text: { type: String },
    jawaban_image: { type: String },
    jawaban_video:{ type: String },
    jawaban_suara: { type: String},
    benar: { type: Boolean, required: true},
    point: { type: Number}
  }
);
const BankSoalSchema = new Schema(
  {
    soal_id: { type: Number},
    soal_text: { type: String , index: true},
    soal_image: { type:String },
    soal_video: { type: String },
    category_id: { type:String ,index: true},
    matpel_id: { type:String,index: true },
    publisher_id:{ type:String ,index: true }, 
    publish: { type:Boolean, default: true}, 
    deleted: { type:Boolean ,default: false},
    bobot: { type : Number },
    type_soal:{ type: String , enum: ['PG', 'ESAY'], default:'PG'},
    jawabans:[JawabanSchema],
    createdBy: { type: String , required: true},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

const ModuleSoalSchema = new Schema(
  {
    module_id: { type: Number ,index: true},
    theme_id: { type: Number , index: true},
    theme_name: { type: String , index: true},
    paket_soal_id: { type: Number, index: true},
    paket_soal: { type: String },
    soals:BankSoalSchema,
    publish: { type: Boolean, default: false , index: true},
    createdAt: { type: Date , default : new Date() },
    updatedAt: { type: Date , default : new Date() },
  }
);

const ModuleSoal = mongoose.model('ModuleSoal', ModuleSoalSchema);

module.exports =  { ModuleSoal }