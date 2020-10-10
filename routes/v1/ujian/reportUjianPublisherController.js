'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Ujian } = require('../../../models/mongoose/Ujian')
// const { SoalUjian } = require('../../../models/mongoose/Soalujian')
// const { MySoalUjian } = require('../../../models/mongoose/MySoalUjian')
const { JawabanUjian} = require('../../../models/mongoose/JawabanUjian')
/**
* Display a Report Ujian by ujian_id
* get all sesi ujian n aggreagte user point
* @return array of Object
*/

router.post('/',async (req, res) => {
  let ujian_id = req.body.ujian_id;

  try {
    const GetUjian = await Ujian.findOne({ _id : ujian_id, deleted: false })
    if (GetUjian) {

      const GetSesiUjian = await JawabanUjian.aggregate([
        {
          $match: {
            ujian_id: { $eq: GetUjian._id}
          }
        },
        { 
          "$group" : {
            _id : { sesi_id :"$sesi_id", user_id: "$user_id" , point: { $sum: "$jawaban.point" }}
          }
        }
      ])
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetSesiUjian
      });
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Ujian Tidak Di Temukan'
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});


module.exports	=	router;