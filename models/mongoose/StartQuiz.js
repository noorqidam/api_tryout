'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StartQuizSchema = new Schema(
  {
    quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    user_id: { type: String},
    email: { type: String , required: true },
    start_time: { type: String },
    end_time:{ type: String},
    nilai:{ type: Number, default: 0 },
    show_nilai: { type: Boolean},
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const StartQuiz = mongoose.model('StartQuiz', StartQuizSchema);
module.exports =  { StartQuiz }