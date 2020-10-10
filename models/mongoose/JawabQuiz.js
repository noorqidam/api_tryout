'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
const JawabanSchema = new Schema(
  {
    _id: { type: String, required: true },
    soal_id : { type: Schema.Types.ObjectId, ref: 'Banksoal' },
    jawaban_text: {type: String },
    jawaban_image: {type: String },
    benar: {type: Boolean, required: true},
    point: {type: Number},
    comment: { type: String},
    reviewer:{type: String}
  }
);
const JawabanQuizSchema = new Schema(
  {
    quiz_id : { type: Schema.Types.ObjectId, ref: 'Quiz' },
    soal_id: { type: Schema.Types.ObjectId, ref: 'Banksoal'},
    user_id: { type: String, required: true},
    profile_id: { type: Schema.Types.ObjectId, ref: 'Profile'},
    email: { type: String },
    name: { type: String },
    school: { type: String },
    kelas: { type: String},
    sub_kelas: { type: String },
    photo: { type: String },
    jawaban :JawabanSchema,
    type_soal:{ type: String , enum: ['PG', 'ESAY'], default:'PG'},
    date: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: moment().format('YYYY-MM-DD')
    }
  }
);

const JawabQuiz = mongoose.model('JawabQuiz', JawabanQuizSchema);
module.exports =  { JawabQuiz }