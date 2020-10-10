'use strict'
const { Books } = require('../../../models/mongoose/Book')
class bookService {

  async count() {
    return await Books.countDocuments();
  }

  async find(limit ,offset) {
    
    return await Books.find()
      .limit(limit)
      .skip(offset)
      .sort({ _id : -1})
  }

  async  findOne(id) {
    return await Books.findById(id)
  }
}

module.exports = bookService;