'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { JawabQuiz  } = require('../../../models/mongoose/JawabQuiz');
const { SoalQuiz } = require('../../../models/mongoose/SoalQuiz')
const moment = require('moment')

/**
* Save Jawaban
* quiz_id : 
  sesi_id : { type : Schema.Types.ObjectId, ref: 'Soalujian'},
  jawaban :{ JawabanSchema }
* @param	String/int 	 id
*
*/

router.get('/',async (req, res) => {
  let auth = req.auth;
  let id = req.query.quiz_id
  let soal = req.query.soal_id
  try {
    const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id : id}) 
    let now = moment().format('YYYY-MM-DD')
    const CheckJawab = await JawabQuiz.findOne({
      email : auth.email,
      quiz_id: GetSoalQuiz.quiz_id,
      soal_id: soal,
      date : {
        $gte: new Date(new Date(now).setHours(0, 0, 0)),
        $lt: new Date(new Date(now).setHours(23, 59, 59))
      }
    });
    if (CheckJawab) {
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data :CheckJawab
      });
    } else {
      return res.status(200).json({
        success : 'false',
        message :'Data Tidak Di Temukan'
      });
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }

  
});

module.exports	=	router;