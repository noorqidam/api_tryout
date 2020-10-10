'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PesertaQuizSchema = new Schema(
  {
    quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    user_id: { type: String},
    email: { type: String , required: true },
    start_time: { type: String , default: null},
    end_time: { type: String , default: null},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

const PesertaQuiz = mongoose.model('PesertaQuiz', PesertaQuizSchema);
module.exports =  { PesertaQuiz }