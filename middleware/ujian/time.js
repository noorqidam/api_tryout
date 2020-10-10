'use strict'
const { Ujian } = require('../../models/mongoose/Ujian')
const moment = require('moment')
/**
 *  Get Date Start Ujian 
 * this function to check Ujian is time to Start @date
 * @requires ujian_id
 */

module.exports = async function CheckStartUjian(req, res , next){
  let id = req.body.quiz_id;

  try {
    const currentDate = moment().format('YYYY-MM-DD')
    const GetUjian = await Ujian.findOne({ _id : id })
    
    if (GetUjian) {
      if (moment(GetUjian.start_date).isSame(currentDate)) {
        next()
      } else if(moment(GetUjian.start_date).isBefore(currentDate)) {
        return res.status(404).json({
          success : 'false',
          message :' Ujian Telah Berakhir'
        });
      } else if(moment(GetUjian.end_date).isAfter(currentDate)) {
        return res.status(404).json({
          success : 'false',
          message :' Ujian Belum Di Mulai'
        });
      } else {
        return res.status(404).json({
          success : 'false',
          message :' Ujian Telah Berakhir'
        });
      }
    } else {
      next()
    }
  } catch (error) {
    next()
  }
}