'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizUserPointSchema = new Schema(
  {
    quiz_id : { type: Schema.Types.ObjectId, ref: 'Quiz' },
    profile_id: { type: Schema.Types.ObjectId, ref: 'Profile'},
    user_id: { type: String, required: true},
    email: { type: String },
    name: { type: String },
    school: { type: String },
    kelas: { type: String},
    sub_kelas: { type: String },
    photo: { type: String },
    point: { type : Number },
    salah: { type: Number },
    benar: { type: Number },
    date: {
      type: Date,
      default: new Date().toString()
    }
  }
);

const QuizUserPoint = mongoose.model('QuizUserPoint', QuizUserPointSchema);
module.exports =  { QuizUserPoint }