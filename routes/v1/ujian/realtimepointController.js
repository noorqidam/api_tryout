'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { JawabanUjian  } = require('../../../models/mongoose/JawabanUjian');
const { Ujian } = require('../../../models/mongoose/Ujian')
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.post('/', async (req, res) => {
  try {
    let ujian_id = req.body.ujian_id;
    if (ujian_id) {
      
      const GetUjian = await Ujian.findOne({ _id: ujian_id, deleted: false })
      if (GetUjian) {
        const RattingPeserta = await JawabanUjian.aggregate([
          { $match: { ujian_id: { $eq: GetUjian._id }} },
          {
            "$group" : { _id :{ user_id: "$user_id", soal_id: "$soal_id"},
              'email':{'$first': '$email'},
              'school': {'$first': '$school'},
              'kelas': {'$first': '$kelas'},
              'sub_kelas': {'$first': '$sub_kelas'},
              'photo' :{'$first':"$photo"},
              "point": { "$first": "$jawaban.point" } }},
          {
            "$group": {
              "_id": "$_id.user_id",
              'email':{'$first': '$email'},
              'school': {'$first': '$school'},
              'kelas': {'$first': '$kelas'},
              'sub_kelas': {'$first': '$sub_kelas'},
              'photo' :{'$first':"$photo"},
              'total_point' : {'$sum': '$point'}
            }
          },
          {
            '$sort': {'total_point': -1}
          }
        ]);
        
        return res.status(200).json({
          success : 'true',
          message :'Ratting Peserta',
          data : RattingPeserta,
          ujian : GetUjian
        });
        
      } else {
        return res.status(404).json({
          success : 'false',
          message :'Data Ujian Tidak Di Temukan'
        });
      }
      
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