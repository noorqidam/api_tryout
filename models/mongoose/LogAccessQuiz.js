'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')

const JawabanQuizSchema = new Schema(
  {
    soal_id : { type: Schema.Types.ObjectId, ref: 'Banksoal' },
    jawaban_text: {type: String },
    jawaban_image: {type: String },
    benar: {type: Boolean, required: true},
    point: {type: Number}
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
    jawabans: [JawabanQuizSchema]
  }
);

const LogAccessQuizSchema = new Schema(
  {
    quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    user_id: { type: String},
    email: { type: String , required: true },
    soals: [BankSoalQuizSchema],
    times_get:{ type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss')},
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const LogAccessQuiz = mongoose.model('LogAccessQuiz', LogAccessQuizSchema);
module.exports =  { LogAccessQuiz }