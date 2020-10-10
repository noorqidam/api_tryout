'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { JawabQuiz  } = require('../../../models/mongoose/JawabQuiz');
const { Quiz } = require('../../../models/mongoose/Quiz')
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/', async (req, res) => {
  try {
    let quiz_id = req.query.quiz_id;
    if (quiz_id) {
      
      const GetQuiz = await Quiz.findById(quiz_id)
      if (GetQuiz) {
        const RattingPeserta = await JawabQuiz.aggregate([
          { $match: { quiz_id: { $eq: GetQuiz._id }} },
          {"$group" : { _id :{ email :"$email", photo :"$photo"},'count':{$sum:1} ,"total_point": { "$sum": "$jawaban.point" } }},
          { $sort: {total_point: -1}}
        ]);
    
        return res.status(200).json({
          success : 'true',
          message :'Data Di Temukan',
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