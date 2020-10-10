'use strict'
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const db      = require('../../../models/index');
const { check, validationResult } = require('express-validator');
const { BankSoal  } = require('../../../models/mongoose/BankSoal');
const mongoose = require('mongoose');
const BanksSoalCache = require('../../../cache/bankSoal');
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
  
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
    const level = await BankSoal.aggregate([
      { 
        $match: { 
          deleted :{ $eq: false }
        }
      },
      {"$group" : { _id :"$category_id",'count':{$sum:1}}}
    ]);
    const matpel = await BankSoal.aggregate([
      { 
        $match: { 
          deleted: { $eq: false }
        }},
      {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
    ]);
    const count = await BankSoal.countDocuments({
      deleted: false
    });
    const Databanksoal = await BankSoal.find({ deleted : false })
      .limit(limit)
      .skip(offset)
      .sort({ _id : -1})
    let dataCache = {
      data : Databanksoal,
      total: count,
      matpel_id: matpel,
      category_id: level
    }
    // let Cachekey = req.baseUrl + req.url;
    // BanksSoalCache.setCache(Cachekey,dataCache)
    return res.status(201).json({
      success : 'true',
      message :'Success',
      data : Databanksoal,
      total: count,
      matpel_id: matpel,
      category_id: level
    });
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

router.get('/filter',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 200;
  let offset = (page * limit) - limit;
  let query = req.query._id;
  let matpel_id = req.query.matpel;
  let publisher = query.split(',');
  let matapelajaran = matpel_id.split(',');

  let level = req.query.level;
  let levels = level.split(',');

  let type = req.query.type;
  let types = type.split(',');

  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {

    if (query) {
      //check level or category 
      if (publisher && level && !matpel_id) {
        const count = await BankSoal.countDocuments({
          publisher_id:{ $in :publisher},
          deleted: { $eq : false},
          category_id:{ $in :levels}
        });
        
        // const M_aggregate = await BankSoal.aggregate([
        //   { $match: { publisher_id: { $in: publisher } , category_id :{ $in : levels} } },
        //   {"$group" : { _id :"matpel_id",'count':{$sum:1}}}
        // ]);
        const Databanksoal = await BankSoal.find({ 
          publisher_id:{ $in :publisher},
          deleted: { $eq : false},
          category_id:{ $in :levels}
        }) 
          .limit(limit)
          .skip(offset)
          .sort({ _id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count,
            //matpel_id : M_aggregate
          });
      } else if (publisher && matpel_id && !level) {
        
        // const C_aggregate = await BankSoal.aggregate([
        //   { $match: { publisher_id: { $in: publisher } ,matpel_id : { $in : matapelajaran} } },
        //   {"$group" : { _id :"$category_id",'count':{$sum:1}}}
        // ]);
        // const M_aggregate = await BankSoal.aggregate([
        //   { $match: { publisher_id: { $in: publisher } ,matpel_id : { $in : matapelajaran} } },
        //   {"$group" : { _id :"$matple_id",'count':{$sum:1}}}
        // ]);
        // const P_aggregate = await BankSoal.aggregate([
        //   { $match: { publisher_id: { $in: publisher } ,matpel_id : { $in : matapelajaran} } },
        //   {"$group" : { _id :"$publisher_id",'count':{$sum:1}}}
        // ]);
        const count = await BankSoal.countDocuments({
          publisher_id:{ $in :publisher},
          deleted: { $eq : false},
          matpel_id:{ $in :matapelajaran}
        })
        const Databanksoal = await BankSoal.find({ 
          publisher_id:{ $in :publisher},
          deleted: { $eq : false},
          matpel_id:{ $in :matapelajaran}
        }) 
          .limit(limit)
          .skip(offset)
          .sort({ _id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count,
            // C_aggregate : C_aggregate,
            // M_aggregate : M_aggregate,
            // P_aggregate : P_aggregate
          });
      } else if (publisher && matpel_id && level) {
        const count = await BankSoal.countDocuments({
          publisher_id:{ $in :publisher},
          deleted: { $eq : false},
          matpel_id:{ $in :matapelajaran},
          category_id:{ $in :levels}
        })
        const Databanksoal = await BankSoal.find({ 
          publisher_id:{ $in :publisher},
          matpel_id:{ $in :matapelajaran},
          deleted: { $eq : false},
          category_id:{ $in :levels}
        }) 
          .limit(limit)
          .skip(offset)
          .sort({ _id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count
          });
      } else {
        // const C_aggregate = await BankSoal.aggregate([
        //   { $match: { publisher_id: { $in: publisher } } },
        //   {"$group" : { _id :"$category_id",'count':{$sum:1}}}
        // ]);
        // const M_aggregate = await BankSoal.aggregate([
        //   { $match: { publisher_id: { $in: publisher } } },
        //   {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
        // ]);
        // const P_aggregate = await BankSoal.aggregate([
        //   { $match: { publisher_id: { $in: publisher } } },
        //   {"$group" : { _id :"$publisher_id",'count':{$sum:1}}}
        // ]);
        const count = await BankSoal.countDocuments({
          publisher_id:{ $in :publisher},
          deleted: { $eq : false},
        })
        const Databanksoal = await BankSoal.find({ 
          publisher_id:{ $in :publisher},
          deleted: { $eq : false},
        }) 
          .limit(limit)
          .skip(offset)
          .sort({ _id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count,
            // C_aggregate : C_aggregate,
            // M_aggregate : M_aggregate,
            // P_aggregate : P_aggregate
          });
      }
    } else {
      //check level or category 
      if (level) {
        if (level && matpel_id) {
          
          // const P_aggregate = await BankSoal.aggregate([
          //   { $match: { category_id: { $in: levels } ,matpel_id :{ $in : matapelajaran} } },
          //   {"$group" : { _id :"$publisher_id",'count':{$sum:1}}}
          // ]);
          const count = await BankSoal.countDocuments({
            matpel_id:{ $in :matapelajaran},
            deleted: { $eq : false},
            category_id:{ $in :levels}
          })
          const Databanksoal = await BankSoal.find({ 
            category_id:{ $in :levels},
            deleted: { $eq : false},
            matpel_id:{ $in :matapelajaran}
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ _id : -1})
            return res.status(201).json({
              success : 'true',
              message :'Success',
              data : Databanksoal,
              total : count,
              //P_aggregate : P_aggregate
            });
        } else {
          // const M_aggregate = await BankSoal.aggregate([
          //   { $match: { category_id: { $in: levels }} },
          //   {"$group" : { _id :"$matple_id",'count':{$sum:1}}}
          // ]);
          // const P_aggregate = await BankSoal.aggregate([
          //   { $match: { category_id: { $in: levels } ,matpel_id :{ $in : matapelajaran} } },
          //   {"$group" : { _id :"$publisher_id",'count':{$sum:1}}}
          // ]);
          const count = await BankSoal.countDocuments({
            category_id:{ $in :levels},
            deleted: { $eq : false},
          })
          const Databanksoal = await BankSoal.find({ 
            category_id:{ $in :levels},
            deleted: { $eq : false},
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ _id : -1})
            return res.status(201).json({
              success : 'true',
              message :'Success',
              data : Databanksoal,
              total : count,
              // M_aggregate : M_aggregate,
              // P_aggregate : P_aggregate
            });
        }
      } else if (matpel_id) {
        const count = await BankSoal.countDocuments({
          matpel_id:{ $in :matapelajaran},
          deleted: { $eq : false},
        })
        const Databanksoal = await BankSoal.find({ 
          matpel_id:{ $in :matapelajaran},
          deleted: { $eq : false},
        }) 
          .limit(limit)
          .skip(offset)
          .sort({ _id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count
          });
      }  else if(type) {

        let gettypes = null
        if (type=='true') {
          gettypes = true
        } 

        const count = await BankSoal.countDocuments({
          deleted: false,
          free_trial: gettypes
        });
        const Databanksoal = await BankSoal.find({
          deleted:false,
          free_trial: gettypes
        })
          .limit(limit)
          .skip(offset)
          .sort({ _id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count
          });
      }else {
        const count = await BankSoal.countDocuments({
          deleted: false
        });
        const Databanksoal = await BankSoal.find({
          deleted:false
        })
          .limit(limit)
          .skip(offset)
          .sort({ _id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count
          });
      }
    }
   
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
    
    const Databanksoal = await BankSoal.findById(id) //{ publisher_id :{ $regex :'bhuana', $options:'i'}}
      //.where('matpel_id').equals('IPA')
      //.select('_id soal_text jawabans.jawaban_text')
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :Databanksoal
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});


module.exports	=	router;