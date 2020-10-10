'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { JawabanUjian  } = require('../../../models/mongoose/JawabanUjian');
const { MySoalUjian } = require('../../../models/mongoose/MySoalUjian')
const { Ujian } = require('../../../models/mongoose/Ujian')


/**
* Save Jawaban
* ujian_id : 
  sesi_id : { type : Schema.Types.ObjectId, ref: 'Soalujian'},
  jawaban :{ JawabanSchema }
* @param	String/int 	 id
*
*/

router.post('/',[
  check('ujian_id').not().isEmpty().withMessage('require'),
],async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() ,validate : false });
  } else {
    let id = req.body.ujian_id;  
    let auth = req.auth
    try {
        const GetUjian = await Ujian.findOne({ _id: id });
        
        if (GetUjian) {
          const GetSesiinSoalUjian =  await MySoalUjian.find({ ujian_id: GetUjian._id , user_id : auth.uid }) //.select('soals ujian_id sesi_id sesi_ujian');
          const getPoint = await JawabanUjian.aggregate([
            { $match: { ujian_id: { $eq: GetUjian._id } ,user_id : { $eq: auth.uid} } },
            { "$group": { _id: { sesi_id: "$sesi_id" }, 'count': { $sum: 1 }, "total_point": { "$sum": "$jawaban.point" } } },
          ])

          let tempreturn = []
          
          for (let index = 0; index < GetSesiinSoalUjian.length; index++) {
            console.log('point ' +JSON.stringify(getPoint))
            //console.log('total point '+getPoint[index].sesi_id +'-'+getPoint[index].total_point)
            tempreturn.push({
              sesi_id : GetSesiinSoalUjian[index]._id,
              sesi_ujian : GetSesiinSoalUjian[index].sesi_ujian,
              point : getPoint[index] ? getPoint[index].total_point : 0,
              count : GetSesiinSoalUjian[index].soals.length
            })
            
          }

          return res.status(200).json({
            success : 'true',
            message :'Data Di Temukan',
            data :  tempreturn
          });

        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            msg: 'Ujian does not exist'
          });
        }

    } catch (error) {
      console.log(error)
      return res.status(500).json({
          success: 'false',
          error: error
      });
    }
  }
});

module.exports	=	router;