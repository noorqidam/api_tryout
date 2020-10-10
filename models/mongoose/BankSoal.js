'use strict'
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

const JawabanSchema = new Schema(
  {
    soal_id : { type: Schema.Types.ObjectId, ref: 'Banksoal' },
    jawaban_text: { type: String },
    jawaban_image: { type: String },
    benar: { type: Boolean, required: true},
    point: { type: Number}
  }
);
const BankSoalSchema = new Schema(
  {
    soal_text: { type: String, index: true},
    soal_image: { type:String },
    soal_video: { type: String },
    category_id: { type:String ,index: true},
    sub_category_id: { type:String ,index: true},
    matpel_id: { type:String,index: true },
    publisher_id:{ type:String ,index: true }, 
    publish: { type:Boolean, default: true}, 
    deleted: { type:Boolean ,default: false},
    bobot: { type : Number },
    type_soal:{ type: String , enum: ['PG', 'ESAY'], default:'PG'},
    jawabans:[JawabanSchema],
    createdBy: { type: String , required: true},
    ref_module:{ type: String},
    module_id: { type: Number},
    free_trial: { type: Boolean, default: false},
    tag: { type: Array},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

const BankSoal = mongoose.model('Banksoal', BankSoalSchema);
module.exports =  { BankSoal }