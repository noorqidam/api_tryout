'use strict'
const { Quiz } = require('../../models/mongoose/Quiz')
const moment = require('moment')
/**
 *  Get Date Start Quiz 
 * this function to check Quiz is time to Start @date
 * @requires auth
 * @requires quiz_id
 */

module.exports = async function CheckStartQuiz(req, res , next){
  let id = req.body.quiz_id;

  try {
    const currentDate = moment().format('YYYY-MM-DD')
    const GetQuiz = await Quiz.findOne({ _id : id })
    
    if (GetQuiz) {
      let GetStartQuiz = moment(GetQuiz.start_date).format('YYYY-MM-DD')
      console.log(currentDate)
      if (moment(GetStartQuiz).isSame(currentDate)) {
        next()
      } else if(moment(GetStartQuiz).isBefore(currentDate)) {
        return res.status(404).json({
          success : 'false',
          message :' Quiz Telah Berakhir'
        });
      } else if(moment(GetStartQuiz).isAfter(currentDate)) {
        return res.status(404).json({
          success : 'false',
          message :' Quiz Belum Di Mulai'
        });
      } else {
        return res.status(404).json({
          success : 'false',
          message :' Quiz Telah Berakhir'
        });
      }
    } else {
      next()
    }
  } catch (error) {
    next()
  }
}