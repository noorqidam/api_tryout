'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ScheduleSchema = new Schema(
  {
    sesi_id: { type: String , required: true },
    sesi_ujian: { type: String },
    position:{ type: Number , unique: true },
    start_time:{ type: String, required: true },
    duration: { type: String }
  }
)

const JadwalSesiUjianSchema = new Schema(
  {
    ujian_id: { type: Schema.Types.ObjectId, ref: 'Ujian' },
    schedule:[ScheduleSchema],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const JadwalSesiUjian = mongoose.model('JadwalSesiUjian', JadwalSesiUjianSchema);
module.exports =  { JadwalSesiUjian }