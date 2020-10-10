'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaketSoalSchema = new Schema(
  {
    paket_soal_id: { type: Number },
    paket_name: { type: String },
    matapelajaran: { type: String },
    trial: { type: Boolean, default: false },
    model_soal_id: { type: String },
    is_timer: { type: Boolean, default: true },
    publish: { type: Boolean, default: true },
  }
)
const ModuleThemeSchema = new Schema(
  {
    module_id: { type: Number },
    theme_id: { type: Number },
    theme_name: { type: String},
    paket_soal:[PaketSoalSchema],
    publish: { type: Boolean, default: true },
    createdAt: { type: Date , default : new Date() },
    updatedAt: { type: Date , default : new Date() },
  }
);

const Moduletheme = mongoose.model('Moduletheme', ModuleThemeSchema);
module.exports =  { Moduletheme }