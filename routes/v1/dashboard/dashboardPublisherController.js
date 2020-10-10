'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { BankSoal  } = require('../../../models/mongoose/BankSoal');
const { Ujian  } = require('../../../models/mongoose/Ujian');
const { Quiz } = require('../../../models/mongoose/Quiz')
const { StartUjian } = require('../../../models/mongoose/StartUjian')
const mongoose = require('mongoose');

/**
 * Return Data Count Ujian GroupBy Auth n Category
 * @requires auth
 * @body json
 */
router.get('/ujian', async (req,res)=> {
  try {

    let publisher = req.auth.accountkey;
    const CountUjians = await Ujian.aggregate([
      { 
        $match: { 
          penyelenggara: { $eq: publisher },
          deleted :{ $eq: false }
        }
      },
      {"$group" : { _id :"$category_ujian",'count':{$sum:1}}}
    ])
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : CountUjians
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})

/**
 * Return Data Count Quiz GroupBy Auth n Category
 * @requires auth
 * @body json
 */

router.get('/quiz', async (req,res)=> {
  try {

    let publisher = req.auth.accountkey;
    const CountQuizs = await Quiz.aggregate([
      { 
        $match: { 
          penyelenggara: { $eq: publisher },
          deleted :{ $eq: false }
        }
      },
      {"$group" : { _id :"$category_quiz",'count':{$sum:1}}}
    ])
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : CountQuizs
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})
/**
 * Return Data BankSoal GroupBy Matapelajaran 
 * @requires auth
 * @body json
 */

router.get('/banksoals-group-matpel', async (req,res)=> {
  try {

    let publisher = req.auth.accountkey;

    const CountAndGroupBankSoal = await BankSoal.aggregate([
      { 
        $match: { 
          publisher_id: { $eq: publisher },
          deleted :{ $eq: false }
        }
      },
      {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
    ])
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : CountAndGroupBankSoal
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})
/**
 * Return Data BankSoal GroupBy Matapelajaran 
 * & Subcategories (kelas)
 * @requires auth
 * @body json
 */
router.get('/banksoals-group-kelas', async (req,res)=> {
  try {

    let publisher = req.auth.accountkey;

    const CountAndGroupBankSoal = await BankSoal.aggregate([
      { 
        $match: { 
          publisher_id: { $eq: publisher },
          deleted :{ $eq: false }
        }
      },
      {"$group" : { _id :"$sub_category_id",'count':{$sum:1}}}
    ])
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : CountAndGroupBankSoal
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})

router.get('/banksoals-group-kelas-matpel', async (req,res)=> {
  try {

    let publisher = req.auth.accountkey;
    
    const CountAndGroupBankSoal = await BankSoal.aggregate([
      { 
        $match: { 
          publisher_id: { $eq: publisher },
          deleted :{ $eq: false }
        }
      },
      
      {$group : { _id :{ sub_category_id:"$sub_category_id",matpel_id: "$matpel_id"}, 'count':{$sum:1}}}
    ])
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : CountAndGroupBankSoal
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})

/**
 * Ratting Peserta all ujian in Publisher
 * @requires auth 
 */
router.get('/ratting-peserta', async (req,res) => {
  let publisher = req.auth.accountkey;
  try {
    const GetRattingPeserta = await StartUjian.aggregate([
      { 
        $match: { 
          publisher_id: { $eq: publisher }
        }
      },
      {
        $group : 
          { 
            _id :{ user_id:"$user_id", ujian_id: '$ujian_id'},
            email: {'$first': '$email'},
            start_time: {'$first': '$start_time'},
            end_time: {'$first': '$end_time'},
            nilai: {'$first': '$nilai'}
          }
      },
      { "$lookup": {     
                "from": "profiles",     
                "localField": "_id.user_id",     
                "foreignField": "user_id",     
                "as": "profile"   
        }}, 
        { "$lookup": {     
          "from": "ujians",     
          "localField": "_id.ujian_id",     
          "foreignField": "_id",     
          "as": "ujian"   
        }}, 
        { "$project": { 
            "_id": 1, 
            "email": 1, 
            "start_time": 1, 
            "end_time": 1, 
            "nilai": 1, 
            "profile": { "$arrayElemAt": [ "$profile", 0 ] },
            "ujian": { "$arrayElemAt": [ "$ujian", 0 ] }
        }},
      {$limit: 20}
    ]).sort({'nilai': -1})
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : GetRattingPeserta
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
 * Dashbord ratting peserta
 * @requires ujian_id
 */
router.get('/ratting-peserta/:ujian_id', async (req, res) => {
  const publisher = req.auth.accountkey;
  const { ujian_id } = req.params;
  const ujianId = mongoose.Types.ObjectId(ujian_id)
  try {
    const GetRattingPeserta = await StartUjian.aggregate([
      { 
        $match: { 
          publisher_id: { $eq: publisher },
          ujian_id: { $eq: ujianId }
        }
      },
      {
        $group : 
          { 
            _id :{ user_id:"$user_id", ujian_id: '$ujian_id'},
            email: {'$first': '$email'},
            start_time: {'$first': '$start_time'},
            end_time: {'$first': '$end_time'},
            nilai: {'$first': '$nilai'}
          }
      },
      { "$lookup": {     
                "from": "profiles",     
                "localField": "_id.user_id",     
                "foreignField": "user_id",     
                "as": "profile"   
        }}, 
        { "$lookup": {     
          "from": "ujians",     
          "localField": "_id.ujian_id",     
          "foreignField": "_id",     
          "as": "ujian"   
        }}, 
        { "$project": { 
            "_id": 1, 
            "email": 1, 
            "start_time": 1, 
            "end_time": 1, 
            "nilai": 1, 
            "profile": { "$arrayElemAt": [ "$profile", 0 ] },
            "ujian": { "$arrayElemAt": [ "$ujian", 0 ] }
        }},
      {$limit: 20}
    ]).sort({'nilai': -1})
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : GetRattingPeserta
    });
  } catch (error) {
    return res.status(500).json({
      success: 'true',
      message: error
    })
  }
});

module.exports = router