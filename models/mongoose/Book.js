'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    key: { type: Number, unique: true , required: true , index: true},
    module_name:{ type: String , required: true , index: true},
    module_slug:{type: String, required: true},
    image:{ type: String },
    price:{ type: Number ,required: true , default: 0},
    description:{ type: String },
    code_number: { type: String },
    kelas:[String],
    publisher: { type: String },
    module_authors: [String],
    categories:[String],
    module_type: { type: String },
    tags:[String],
    publish: { type: Boolean, default: false },
    createdAt: { type: Date , default : new Date() },
    updatedAt: { type: Date , default : new Date() },
  }
);

const Books = mongoose.model('Books', BookSchema)

module.exports =  { Books }