'use strict'
const { Ujian } = require('../../models/mongoose/Ujian')
const { MySoalUjian } = require('../../models/mongoose/MySoalUjian')
/**
 *  Single Start Quiz
 * @requires auth
 * @requires ujian_id
 */

module.exports = async function MySoal(req, res , next){
  let id = req.body.ujian_id;
  let sesi_id = req.body.sesi_id
  let auth = req.auth;
  try {

    const GetUjian = await Ujian.findOne({ _id : id })

    if (GetUjian._id) {
      const MySoal = await MySoalUjian.findOne({
        ujian_id : GetUjian._id,
        sesi_id: sesi_id,
        user_id: auth.uid
      });
      
      if (MySoal) {
        console.log('find MySoal Quiz ' + id)
        return res.status(200).json({
          success : 'true',
          message :'Soal Quiz ' + auth.email,
          soals : MySoal,
          ujian: GetUjian,
          sesi_id: sesi_id,
          duration: MySoal.duration,
          sesi_ujian: MySoal.sesi_ujian,
          start: MySoal
        });
      } else {
        //console.log('checking Soal ' + auth.email + ' => Not Found and next router' )
        next()
      }
    } else {
      next()
    }
  } catch (error) {
    next()
  }
}