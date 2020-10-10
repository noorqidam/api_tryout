'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment  = require('moment')
moment.locale('id')
const TrashQuizSchema = new Schema(
  {
    judul_quiz: { type: String, index: true },
    quiz_slug: { type: String, required : true },
    quiz_banner: { type: String },
    type_quiz: { type: String},
    is_premium : { type : Boolean , required : true },
    is_private: { type: Boolean},
    category_quiz : { type: String  },
    penyelenggara :  { type : String , index: true},
    start_date : { type : Date},
    type_start: { type : String},
    durasi_soal: { type : Number},
    times : { type : String},
    end_times : { type : String},
    end_date : { type : Date},
    description : { type : String},
    publish: { type : Boolean  },
    waktu_pengerjaan : { type : String},
    metode_penilaian: { type: String },
    createdBy: { type: String , required: true},
    createdAt: {
      type: Date,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }
);


const TrashQuiz = mongoose.model('TrashQuiz', TrashQuizSchema);
module.exports =  { TrashQuiz }