'use strict'
const { Quiz } = require('../../models/mongoose/Quiz')
const { MySoalQuiz } = require('../../models/mongoose/MySoalQuiz')
/**
 *  Single Start Quiz
 * @requires auth
 * @requires quiz_id
 */

module.exports = async function MySoal(req, res , next){
  let id = req.body.quiz_id;
  let auth = req.auth;
  try {

    const GetQuiz = await Quiz.findOne({ _id : id })

    if (GetQuiz._id) {
      const MySoal = await MySoalQuiz.findOne({
        quiz_id : GetQuiz._id,
        user_id: auth.uid
      });

      if (MySoal) {
        console.log('find MySoal Quiz ' + id)
        return res.status(200).json({
          success : 'true',
          message :'Soal Quiz ' + auth.email,
          soals : MySoal,
          quiz: GetQuiz
        });
      } else {
        console.log('checking Soal ' + auth.email + ' => Not Found and next router' )
        next()
      }
    } else {
      next()
    }
  } catch (error) {
    next()
  }
}