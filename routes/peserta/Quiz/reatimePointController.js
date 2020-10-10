const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {SoalQuiz} = require('../../../models/mongoose/SoalQuiz');
const {JawabQuiz} = require('../../../models/mongoose/JawabQuiz');

/**
 * Get Point in QUiz realtimesoal
 */
router.post('/', [
  check('quiz_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    });
  } else {
    let id = req.body.quiz_id;
    let auth = req.auth
    try {
      const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id : id})
      if(GetSoalQuiz){
        const point  = await JawabQuiz.aggregate([
          { $match: { quiz_id: { $eq: GetSoalQuiz.quiz_id } , email : { $eq : auth.email}} },
          {"$group" : { _id :{ user_id :"$user_id"},'count':{$sum:1} ,"total_point": { "$sum": "$jawaban.point" } }}
        ])
        console.log(point)
        return res.status(200).json({
          success : 'true',
          message :'Data Di Temukan',
          data : point[0] ? point[0].total_point : 0
        });
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Quiz not found'
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

module.exports = router;