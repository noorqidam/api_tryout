'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressSchema = new Schema(
  {
    sesi_id:{ type: String , required: true},
    sesi_name:{ type: String},
    current: { type: Boolean}
  }
)
const StartUjianSchema = new Schema(
  {
    ujian_id: { type: Schema.Types.ObjectId, ref: 'Ujian' },
    sesi_id: { type: Schema.Types.ObjectId, ref: 'SoalUjian' },
    publisher_id: {type: String},
    user_id: { type: String},
    email: { type: String , required: true },
    start_time: { type: String },
    end_time:{ type: String, default: null},
    nilai: { type: Number, default: 0 },
    ip_address: { type: String},
    show_nilai: { type: Boolean},
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const StartUjian = mongoose.model('StartUjian', StartUjianSchema);
module.exports =  { StartUjian }