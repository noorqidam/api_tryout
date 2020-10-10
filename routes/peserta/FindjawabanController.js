'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { JawabanUjian  } = require('../../models/mongoose/JawabanUjian');


/**
 * Check Jawaban Exist In Ujian , Sesi and User
 */
router.get('/', async(req,res) => {
  try {
    let auth = req.auth;
    let sesi = req.query.sesi_id
    let soal_id = req.query.soal_id
    const SOAL_UJIAN = await JawabanUjian.findOne({ sesi_id: sesi, soal_id:soal_id ,email:auth.email},'ujian_id soal_id jawaban._id')

    if (SOAL_UJIAN) {
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data :SOAL_UJIAN
      });
    } else {
      return res.status(200).json({
        success : 'false',
        message :'Data Tidak Di Temukan'
      });
    }
    

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})

module.exports	=	router;