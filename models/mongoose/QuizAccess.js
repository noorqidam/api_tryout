'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
moment.locale('id')
const QuizAccessSchema = new Schema(
  {
    quiz_id : { type: Schema.Types.ObjectId, ref: 'Quiz' },
    acces_pin: { type: String, required : true},
    createdAt: {
      type: Date,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }
);


const QuizAccess = mongoose.model('QuizAccess', QuizAccessSchema);
module.exports =  { QuizAccess }