'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Ujian  } = require('../../../models/mongoose/Ujian');
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
    const GetLiveTest = await Ujian.find({ publish: true ,start_date: { $gte:now , $lt : maxNow}})
      .limit(limit)
      .skip(offset)
      .sort({ id : -1})
    let dataCache = {
      rows : GetLiveTest
    }
    
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