'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type_soal:{ type: String },
    publish: { type:Boolean },
    deleted: { type:Boolean },
    jawabans: [JawabanQuizSchema]
  }
);
const SoalQuizSchema = new Schema(
  {
    quiz_id : { type: Schema.Types.ObjectId, ref: 'Quiz' },
    soals :[BankSoalQuizSchema],
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

const SoalQuiz = mongoose.model('SoalQuiz', SoalQuizSchema);
module.exports =  { SoalQuiz }