'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Quiz  } = require('../../../models/mongoose/Quiz');
const { SoalQuiz } = require('../../../models/mongoose/SoalQuiz')
const moment = require('moment')
const QuizCache = require('../../../cache/quizCache')
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',QuizCache.getCache,async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
   
    const DaftarQuiz = await Quiz.find({ publish: true})
      .limit(limit)
      .skip(offset)
      .sort({ id : -1});
    
    const url =  req.baseUrl + req.url;
    QuizCache.setCache(url,DaftarQuiz)
    return res.status(201).json({
      success : 'true',
      message :'Success',
      data :DaftarQuiz
    });
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/:id',async (req, res) => {
  let id = req.params.id
  try {
    let startButton = false;
    let expireButton =false;
    let countDowntimmer = false
    const GetQuiz = await Quiz.findById(id)

    if (GetQuiz) {
      const GetSoalinQuiz = await SoalQuiz.findOne({ quiz_id : GetQuiz._id})
      let CountSoal = 0
      if(GetSoalinQuiz){
        CountSoal = GetSoalinQuiz.soals.length
      }

      const getDate = moment(GetQuiz.start_date).format('YYYY-MM-DD')
      const getEndDate = moment(GetQuiz.end_date).format('YYYY-MM-DD')
      const Hour = GetQuiz.times
      const MaxHour = GetQuiz.end_times
      const getHour = Hour.substring(0, 2)
      const getMinutes = Hour.substring(3, 5)
      const getMaxHours = MaxHour.substring(0, 2)
      const getMaxMinutes = MaxHour.substring(3, 5)

      const FullDateTime = moment(getDate).add(getHour, 'h').add(getMinutes, 'm')
      const EndDateTime = moment(getEndDate).add(getMaxHours, 'h').add(getMaxMinutes, 'm')

      const StartDateTimeQuiz = moment(FullDateTime).format('YYYY-MM-DD HH:mm')
      const EndDatetimeQuiz = moment(EndDateTime).format('YYYY-MM-DD HH:mm')
      const DatetimesNow = moment().format('YYYY-MM-DD HH:mm')
      console.log('Date time Server is => ' +DatetimesNow + ' % ' + 'Date time Quiz ' + StartDateTimeQuiz)
      if(moment(DatetimesNow).isSame(StartDateTimeQuiz)){
        startButton = true
        console.log('Quiz di Mulai')
      }
      if(moment(DatetimesNow).isAfter(StartDateTimeQuiz) && moment(DatetimesNow).isBefore(EndDatetimeQuiz)){
        startButton = true
        console.log('Quiz di Mulai')
      } else if(moment(DatetimesNow).isBefore(StartDateTimeQuiz)){
        console.log('Quiz Belum di Mulai')
        countDowntimmer = true
      } else if(moment(DatetimesNow).isAfter(EndDatetimeQuiz)){
        expireButton = true
      }

      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data :GetQuiz,
        count_soals : CountSoal,
        start_quiz: startButton,
        current_times: DatetimesNow,
        start_time :StartDateTimeQuiz,
        end_times: EndDatetimeQuiz,
        countDowntimmer: countDowntimmer,
        expireButton: expireButton
      });
    } else {
      return res.status(400).json({
        success : 'false',
        message :'Data QUiz Tidak Di Temukan',
        data :{}
      });
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

module.exports	=	router;