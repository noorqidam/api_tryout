'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Quiz  } = require('../../../models/mongoose/Quiz');

/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let id = req.query.id
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
   
    const DaftarQuiz = await Quiz.find()
      .where('_id').nin([id])
      .where('publish').equals(true)
      .limit(limit)
      .skip(offset)
      .sort({ id : -1});
      
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

module.exports	=	router;