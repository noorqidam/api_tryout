'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { BankSoal  } = require('../../../models/mongoose/BankSoal');
const AggregateCache = require('../../../cache/bankSoal');


/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/level',AggregateCache.getCache,async (req, res) => {
  try {
    const level = await BankSoal.aggregate([
      {"$group" : { _id :"$category_id",'count':{$sum:1}}}
    ]);
    let Cachekey = req.baseUrl + req.url;
    AggregateCache.setCache(Cachekey,level)
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :level
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});


router.get('/matapelajaran',AggregateCache.getCache,async (req, res) => {
  try {
    const Matple = await BankSoal.aggregate([
      {"$group" : {_id:"$matpel_id" ,'count':{$sum:1}}}
    ]);
    let Cachekey = req.baseUrl + req.url;
    AggregateCache.setCache(Cachekey,Matple)
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :Matple
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

router.get('/publisher',AggregateCache.getCache,async (req, res) => {
  try {
    const Publisher = await BankSoal.aggregate([
      {"$group" : {_id:"$publisher_id" ,'count':{$sum:1}}}
    ]);

    let Cachekey = req.baseUrl + req.url;
    AggregateCache.setCache(Cachekey,Publisher);

    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :Publisher
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