'use strict'
const { StartQuiz } = require('../../models/mongoose/StartQuiz')
const { Quiz } = require('../../models/mongoose/Quiz')

/**
 *  Single Start Quiz
 * @requires auth
 * @requires quiz_id
 */

module.exports = async function SingleStart(req, res , next){
  let id = req.query.quiz_id;
  let auth = req.auth;

  try {

    const GetQuiz = await Quiz.findOne({ _id : id })

    const CheckHasStopQuiz = await StartQuiz.findOne({
      quiz_id: GetQuiz._id,
      email: auth.email,
      show_nilai: true
    })

    if (CheckHasStopQuiz) {
      return res.status(403).json({
        success : 'false',
        message :'Anda Telah Mengakhiri Quiz ',
        data:'stoped',
        info: auth.email
      });
    } else {
      next()
    }
  } catch (error) {
    next()
  }
}