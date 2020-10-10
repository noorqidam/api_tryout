'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema(
  {
    judul_quiz: { type: String, required : true, index: true },
    quiz_slug: { type: String, required : true },
    quiz_banner: { type: String },
    type_quiz: { type: String, required: true},
    is_premium : { type : Boolean , required : true  , default: false},
    is_private: { type: Boolean, required: true ,default:false},
    category_quiz : { type: String , required: true },
    penyelenggara :  { type : String , required : true, index: true},
    start_date : { type : Date},
    type_start: { type : String},
    durasi_soal: { type : String , default : 60},
    times : { type : String},
    end_times : { type : String},
    end_date : { type : Date},
    description : { type : String},
    publish: { type : Boolean , required: true },
    deleted: { type : Boolean, default: false },
    waktu_pengerjaan : { type : String},
    metode_penilaian: { type: String , required: true},
    price : { type : String},
    createdBy: { type: String , required: true},
    deletedBy: {type: String},
    deletedAt: {type: Date},
    restoredBy: {type: String},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);


const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports =  { Quiz }