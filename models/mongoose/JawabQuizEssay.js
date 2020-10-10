'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JawabanSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    soal_id : { type: Schema.Types.ObjectId, ref: 'Banksoal' },
    jawaban_text: {type: String },
    comment: {type: String},
    nilai: {type: Number},
    reviewer : {type: String}
  }
);
const JawabQuizSchema = new Schema(
  {
    quiz_id : { type: Schema.Types.ObjectId, ref: 'Quiz' },
    soal_id : { type: Schema.Types.ObjectId, required:true, ref: 'Banksoal' },
    user_id: { type: String, required: true},
    photo: { type: String },
    email: { type: String },
    jawaban : JawabanSchema,
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



const JawabQuizEssay = mongoose.model('JawabQuizEssay', JawabQuizSchema);
module.exports =  { JawabQuizEssay }