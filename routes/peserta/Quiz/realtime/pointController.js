'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { JawabQuiz  } = require('../../../../models/mongoose/JawabQuiz');
const { Quiz } = require('../../../../models/mongoose/Quiz')
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.post('/', async (req, res) => {
  try {
    let quiz_id = req.body.quiz_id;
    if (quiz_id) {
      
      const GetQuiz = await Quiz.findById(quiz_id)
      if (GetQuiz) {
        const RattingPeserta = await JawabQuiz.aggregate([
          { $match: { quiz_id: { $eq: GetQuiz._id }} },
          {"$group" : { _id :{ user_id: "$user_id"},
          'email':{'$first': '$email'},
          'name':{'$first': '$name'},
          'school': {'$first': '$school'},
          'kelas': {'$first': '$kelas'},
          'sub_kelas': {'$first': '$sub_kelas'},
          'photo' :{'$first':"$photo"},
          'count':{$sum:1} ,"total_point": { "$sum": "$jawaban.point" } }},
          { $sort: {total_point: -1}}
        ]);
    
        return res.status(200).json({
          success : 'true',
          message :'Ratting Peserta',
          data : RattingPeserta,
          quiz : GetQuiz
        });
      } else {
        return res.status(404).json({
          success : 'false',
          message :'Data Quiz Tidak Di Temukan'
        });
      }
      
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Quiz Tidak Di Temukan'
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