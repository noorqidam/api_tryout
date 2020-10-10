'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PesertaSchema = new Schema(
  {
    ujian_id: { type: Schema.Types.ObjectId, ref: 'Ujian' },
    user_id: { type: String},
    email: { type: String , required: true },
    start_time: { type: String },
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now
    }
  }
);

const PesertaUjian = mongoose.model('PesertaUjian', PesertaSchema);
module.exports =  { PesertaUjian }