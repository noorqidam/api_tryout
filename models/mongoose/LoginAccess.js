'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginSchema = new Schema(
  {
    email: { type: String, required:true, index: true },
    ip_address: { type: String },
    status:{ type: String},
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const LoginAcceess = mongoose.model('LoginAcceess', LoginSchema);
module.exports =  { LoginAcceess }