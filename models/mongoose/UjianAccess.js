'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
moment.locale('id')
const UjianAccessSchema = new Schema(
  {
    ujian_id : { type: Schema.Types.ObjectId, ref: 'Ujian' },
    acces_pin: { type: String, required : true},
    createdAt: {
      type: Date,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }
);


const UjianAccess = mongoose.model('UjianAccess', UjianAccessSchema);
module.exports =  { UjianAccess }