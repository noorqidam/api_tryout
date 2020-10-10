'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Quiz  } = require('../../../models/mongoose/Quiz');
const { SoalQuiz  } = require('../../../models/mongoose/SoalQuiz');
const moment = require('moment')
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/', async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  let now = moment().format('YYYY-MM-DD')
  let maxNow =  moment().add(1,'days')
  console.log(now)
  console.log(maxNow)
  try {
    const GetLiveTest = await Quiz.find({ publish: true, start_date: { $gte:now , $lt : maxNow}})
      .limit(limit)
      .skip(offset)
      .sort({ id : -1})

    //console.table(GetLiveTest)
    return res.status(201).json({
      success : 'true',
      message :'Success',
      data : GetLiveTest
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
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/:id', async (req, res) => {
  let id = req.params.id;
  try {
    const GetLiveTest = await SoalQuiz.findOne({ quiz_id: id}).populate({ path :'quiz_id'})

    //console.table(GetLiveTest)
    return res.status(201).json({
      success : 'true',
      message :'Success',
      data : GetLiveTest
    });
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

module.exports	=	router;