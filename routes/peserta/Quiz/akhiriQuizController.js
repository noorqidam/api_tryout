const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { StartQuiz } = require('./../../../models/mongoose/StartQuiz');
const { JawabQuiz } = require('./../../../models/mongoose/JawabQuiz')

/**
 * module function Stop Quiz 
 * @request body
 * quiz_id
 */
router.post('/', [
    check('quiz_id').exists().withMessage('quiz id required')
  ], async (req, res) => {
    const auth = req.auth
    const err = validationResult(req);
    if(!err.isEmpty()){
      return res.status(422).json({
        success: 'false',
        error: err
      });
    } else {
      const quiz_id  = req.body.quiz_id;
      try {
        const getStartQuiz = await StartQuiz.findOne({quiz_id: quiz_id, user_id :auth.uid});
        if (getStartQuiz) {
          const scorePeserta = await JawabQuiz.aggregate([
						{ $match: { quiz_id: { $eq: getStartQuiz.quiz_id }, user_id: {$eq: getStartQuiz.user_id} } },
						{ 
							"$group": {
								_id: { user_id: "$user_id" },
								'email':{'$first': '$email'},
								'count': { $sum: 1 },
								"total_point": { "$sum": "$jawaban.point" } } 
						}
          ])
          let endStartQuiz = {
            show_nilai : true,
            nilai : scorePeserta[0].total_point,
            end_time : new Date()
          }
         
          
          const info = await getStartQuiz.updateOne(endStartQuiz);
          return res.status(200).json({
            success: 'true',
            message: 'akhiri quiz '+ quiz_id + ' success',
            info:info 
          })
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            message: 'Start Quiz not found'
          })
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: 'false',
          error: error
        })
      }
    }
});
module.exports = router;