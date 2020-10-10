'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaketSoalSchema = new Schema(
  {
    module_key: { type : String },
    theme_id: { type: Schema.Types.ObjectId, ref: 'ModuleTheme'},
    paket_soal_id: { type: Number },
    paket_name: { type: String },
    matapelajaran: { type: String },
    trial: { type: Boolean, default: false },
    model_soal_id: { type: String },
    is_timer: { type: Boolean, default: true },
    publish: { type: Boolean, default: true },
  }
)

const ModulePaketSoal = mongoose.model('ModulePaketSoal', PaketSoalSchema);
module.exports =  { ModulePaketSoal }