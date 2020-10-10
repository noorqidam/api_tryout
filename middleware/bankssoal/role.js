'use strict'
const { BankSoal  } = require('../../models/mongoose/BankSoal');
/**
 * Validate User Edutore
 */
module.exports = async function Valid(req, res , next){
  let auth = req.auth;
  if (auth.role ==='ADMIN') {
    next();
  } else {
    const GeetbankSoal = await BankSoal.findOne({ _id : req.body._id})
    if (GeetbankSoal) {
      if (GeetbankSoal.createdBy === auth.username) {
        next()
      } else {
        return res.status(403).json({
          success : 'false',
          message :'UnAuthorized'
        });
      }
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Data Tidak Di Temukan'
      });
    }

  }
}