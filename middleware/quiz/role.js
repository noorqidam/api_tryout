'use strict'
const { Quiz  } = require('../../models/mongoose/Quiz');
/**
 * @requires quiz_id
 */
module.exports = async function Valid(req, res , next){
  let auth = req.auth.role;
  if (auth ==='ADMIN') {
    next();
  } else {
    const GetQuiz = await Quiz.findOne({ _id : req.body.quiz_id})
    if (GetQuiz) {
      if (GetQuiz.createdBy === auth.username) {
        next()
      } else {
        return res.status(403).json({
          success : 'false',
          message :'UnAuthorized'
        });
      }
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Data Tidak Di Temukan'
      });
    }

  }
}