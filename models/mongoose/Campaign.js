'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
moment.locale('id')
const CampaignSchema = new Schema(
  {
    campaign_title: { type: String, required : true, index: true },
    position: { type: String, required : true },
    campaign_banner: { type: String },
    link: { type: String, required: true},
    publish: {type: Boolean, default: false},
    deleted: {type: Boolean ,default: false},
    createdAt: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: moment().format('YYYY-MM-DD')
    }
  }
);


const Campaign = mongoose.model('Campaign', CampaignSchema);
module.exports =  { Campaign }