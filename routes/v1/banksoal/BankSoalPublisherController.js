'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { BankSoal  } = require('../../../models/mongoose/BankSoal');
const BanksSoalCache = require('../../../cache/bankSoal');
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/', async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let publisher = req.auth.accountkey;
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  let auth = req.auth;
  if (auth.role === 'ADMIN' || auth.role === 'STAF') {
    try {
      const level = await BankSoal.aggregate([
        { 
          $match: { 
            publisher_id: { $eq: publisher },
            deleted :{ $eq: false }
          }
        },
        {"$group" : { _id :"$category_id",'count':{$sum:1}}}
      ]);
      const Sublevel = await BankSoal.aggregate([
        { 
          $match: { 
            publisher_id: { $eq: publisher },
            deleted :{ $eq: false }
          }
        },
        {"$group" : { _id :"$sub_category_id",'count':{$sum:1}}}
      ]);
      const matpel = await BankSoal.aggregate([
        { 
          $match: { 
            publisher_id: { $eq: publisher },
            deleted: { $eq: false }
          }},
        {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
      ]);
      const count = await BankSoal.countDocuments({
        publisher_id:{ $eq :publisher},
        deleted : { $eq : false }
      });
      const Databanksoal = await BankSoal.find({ 
        publisher_id:{ $eq :publisher}, 
        deleted : { $eq : false }})
        .limit(limit)
        .skip(offset)
        .sort({ _id : -1})
     
      let dataCache = {
        data : Databanksoal,
        total: count,
        matpel_id: matpel,
        category_id: level,
        sub_category_id: Sublevel
      }
      let Cachekey = req.baseUrl + req.url + auth.username;
      BanksSoalCache.setCache(Cachekey,dataCache)
      return res.status(201).json({
        success : 'true',
        message :'Success',
        data : Databanksoal,
        total: count,
        matpel_id: matpel,
        category_id: level,
        sub_category_id: Sublevel
      });
     
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  } else {
    try {

      const level = await BankSoal.aggregate([
        { 
          $match: { 
            publisher_id: { $eq: publisher },
            deleted :{ $eq: false },
            createdBy:{ $eq : auth.username}
          }
        },
        {"$group" : { _id :"$category_id",'count':{$sum:1}}}
      ]);
      const Sublevel = await BankSoal.aggregate([
        { 
          $match: { 
            publisher_id: { $eq: publisher },
            createdBy:{ $eq : auth.username},
            deleted :{ $eq: false }
          }
        },
        {"$group" : { _id :"$sub_category_id",'count':{$sum:1}}}
      ]);
      const matpel = await BankSoal.aggregate([
        { 
          $match: { 
            publisher_id: { $eq: publisher },
            deleted: { $eq: false },
            createdBy:{ $eq : auth.username}
          }},
        {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
      ]);
      const count = await BankSoal.countDocuments({
        publisher_id:{ $eq :publisher},
        deleted : { $eq : false },
        createdBy:{ $eq : auth.username}
      });

      const Databanksoal = await BankSoal.find({ publisher_id:{ $eq :publisher},createdBy:{ $eq : auth.username} , deleted : { $eq : false }})
        .limit(limit)
        .skip(offset)
        .sort({ _id : -1})
      
      let dataCache = {
        data : Databanksoal,
        total: count,
        matpel_id: matpel,
        category_id: level,
        sub_category_id: Sublevel
      }
      let Cachekey = req.baseUrl + req.url;
      //BanksSoalCache.setCache(Cachekey,dataCache)

      return res.status(201).json({
        success : 'true',
        message :'Success',
        data : Databanksoal,
        total: count,
        matpel_id: matpel,
        category_id: level,
        sub_category_id: Sublevel
      });
     
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
  
});

router.get('/filter',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 200;
  let offset = (page * limit) - limit;
  let matpel_id = req.query.matpel;
  let matapelajaran = matpel_id ? matpel_id.split(',') : null
  let level = req.query.level;
  let sublevel = req.query.sub_level
  let levels = level?  level.split(',') : null
  let sublevels = sublevel?  sublevel.split(',') : null
  let publisher = req.auth.accountkey;

  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  try {
  console.log('matpel' +matpel_id)
  console.log('level ' +level)
  console.log('sub level ' +sublevel)
  let auth = req.auth;
    if (auth.role === 'ADMIN' || auth.role === 'STAF') {
      //check level or category 
      if (levels) {
        console.log('filter by level')
        if (level && matpel_id) {
          console.log('filter by level & matpel')
          const level = await BankSoal.aggregate([
            { 
              $match: { 
                matpel_id:{ $in :matapelajaran},
                category_id:{ $in :levels},
                publisher_id: { $eq: publisher },
                matpel_id: { $eq: matpel_id},
                deleted :{ $eq: false }
              }
            },
            {"$group" : { _id :"$category_id",'count':{$sum:1}}}
          ]);
          const matpel = await BankSoal.aggregate([
            { 
              $match: { 
                matpel_id:{ $in :matapelajaran},
                category_id:{ $in :levels},
                publisher_id: { $eq: publisher },
                deleted: { $eq: false }
              }},
            {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
          ]);
          const count = await BankSoal.countDocuments({
            matpel_id:{ $in :matapelajaran},
            category_id:{ $in :levels},
            deleted : { $eq : false },
            publisher_id: { $eq: publisher },
          })
          const Databanksoal = await BankSoal.find({ 
            category_id:{ $in :levels},
            matpel_id:{ $in :matapelajaran},
            deleted : { $eq : false },
            publisher_id: { $eq: publisher },
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ id : -1})
            return res.status(201).json({
              success : 'true',
              message :'Success',
              data : Databanksoal,
              total : count,
              matpel_id: matpel,
              category_id: level
              //P_aggregate : P_aggregate
            });
        } else {
          const level = await BankSoal.aggregate([
            { 
              $match: { 
                category_id:{ $in :levels},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false }
              }
            },
            {"$group" : { _id :"$category_id",'count':{$sum:1}}}
          ]);
          const matpel = await BankSoal.aggregate([
            { 
              $match: { 
                category_id:{ $in :levels},
                publisher_id: { $eq: publisher },
                deleted: { $eq: false }
              }},
            {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
          ]);
          const count = await BankSoal.countDocuments({
            category_id:{ $in :levels},
            deleted : { $eq : false },
            publisher_id: { $in : publisher}
          })
          const Databanksoal = await BankSoal.find({ 
            category_id:{ $in :levels},
            deleted : { $eq : false },
            publisher_id: { $in : publisher}
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ id : -1})
            return res.status(201).json({
              success : 'true',
              message :'Success',
              data : Databanksoal,
              total : count,
              matpel_id: matpel,
              category_id: level
            });
        }
      } else if(sublevels){
        if (sublevel && matpel_id) {
          const level = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                matpel_id: { $in: matapelajaran},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false }
              }
            },
            {"$group" : { _id :"$category_id",'count':{$sum:1}}}
          ]);
          const Sublevel = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                matpel_id: { $in: matapelajaran},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false }
              }
            },
            {"$group" : { _id :"$sub_category_id",'count':{$sum:1}}}
          ]);
          const matpel = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                publisher_id: { $eq: publisher },
                deleted: { $eq: false }
              }},
            {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
          ]);

          const count = await BankSoal.countDocuments({
            sub_category_id:{ $in :sublevels},
            matpel_id: { $in: matapelajaran},
            deleted : { $eq : false },
            publisher_id: { $in : publisher}
          })
          const Databanksoal = await BankSoal.find({ 
            sub_category_id:{ $in :sublevels},
            matpel_id: { $in: matapelajaran},
            deleted : { $eq : false },
            publisher_id: { $in : publisher}
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ id : -1})
            
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count,
            matpel_id: matpel,
            category_id: level,
            sub_category_id: Sublevel
          });
        } else {
          const level = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false }
              }
            },
            {"$group" : { _id :"$category_id",'count':{$sum:1}}}
          ]);
          const Sublevel = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false }
              }
            },
            {"$group" : { _id :"$sub_category_id",'count':{$sum:1}}}
          ]);
          const matpel = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                publisher_id: { $eq: publisher },
                deleted: { $eq: false }
              }},
            {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
          ]);

          const count = await BankSoal.countDocuments({
            sub_category_id:{ $in :sublevels},
            deleted : { $eq : false },
            publisher_id: { $in : publisher}
          })
          const Databanksoal = await BankSoal.find({ 
            sub_category_id:{ $in :sublevels},
            deleted : { $eq : false },
            publisher_id: { $in : publisher}
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ id : -1})
            return res.status(201).json({
              success : 'true',
              message :'Success',
              data : Databanksoal,
              total : count,
              matpel_id: matpel,
              category_id: level,
              sub_category_id: Sublevel
            });
        }
        
       
      }else if (matpel_id) {
        console.log('ada matpel')
        const level = await BankSoal.aggregate([
          { 
            $match: { 
              publisher_id: { $eq: publisher },
              matpel_id: { $eq: matpel_id},
              deleted :{ $eq: false }
            }
          },
          {"$group" : { _id :"$category_id",'count':{$sum:1}}}
        ]);
        const matpel = await BankSoal.aggregate([
          { 
            $match: { 
              publisher_id: { $eq: publisher },
              deleted: { $eq: false }
            }},
          {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
        ]);
        const count = await BankSoal.countDocuments({
          matpel_id:{ $in :matapelajaran},
          deleted : { $eq : false },
          publisher_id: { $eq: publisher },
        })
        const Databanksoal = await BankSoal.find({ 
          matpel_id:{ $in :matapelajaran},
          deleted : { $eq : false },
          publisher_id: { $eq: publisher },
        }) 
          .limit(limit)
          .skip(offset)
          .sort({ id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count,
            matpel_id: matpel,
            category_id: level
          });
      } else {
        const level = await BankSoal.aggregate([
          { 
            $match: { 
              publisher_id: { $eq: publisher },
              deleted :{ $eq: false }
            }
          },
          {"$group" : { _id :"$category_id",'count':{$sum:1}}}
        ]);
        const matpel = await BankSoal.aggregate([
          { 
            $match: { 
              publisher_id: { $eq: publisher },
              deleted: { $eq: false }
            }},
          {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
        ]);
        const count = await BankSoal.countDocuments({
          publisher_id:{ $eq :publisher},
          deleted : { $eq : false }
        });
        
        const Databanksoal = await BankSoal.find({
          publisher_id: { $eq: publisher },
          deleted : { $eq : false }
        })
          .limit(limit)
          .skip(offset)
          .sort({ id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total: count,
            matpel_id: matpel,
            category_id: level
          });
        
      }
    } else {
      if (levels) {
        console.log('filter by level')
        if (level && matpel_id) {
          console.log('filter by level & matpel')
          const level = await BankSoal.aggregate([
            { 
              $match: { 
                matpel_id:{ $in :matapelajaran},
                category_id:{ $in :levels},
                publisher_id: { $eq: publisher },
                matpel_id: { $eq: matpel_id},
                deleted :{ $eq: false },
                createdBy:{ $eq : auth.username}
              }
            },
            {"$group" : { _id :"$category_id",'count':{$sum:1}}}
          ]);
          const matpel = await BankSoal.aggregate([
            { 
              $match: { 
                matpel_id:{ $in :matapelajaran},
                category_id:{ $in :levels},
                publisher_id: { $eq: publisher },
                deleted: { $eq: false },
                createdBy:{ $eq : auth.username}
              }},
            {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
          ]);
          const count = await BankSoal.countDocuments({
            matpel_id:{ $in :matapelajaran},
            category_id:{ $in :levels},
            deleted : { $eq : false },
            publisher_id: { $eq: publisher },
            createdBy:{ $eq : auth.username}
          })
          const Databanksoal = await BankSoal.find({ 
            category_id:{ $in :levels},
            matpel_id:{ $in :matapelajaran},
            deleted : { $eq : false },
            publisher_id: { $eq: publisher },
            createdBy:{ $eq : auth.username}
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ id : -1})
            return res.status(201).json({
              success : 'true',
              message :'Success',
              data : Databanksoal,
              total : count,
              matpel_id: matpel,
              category_id: level
              //P_aggregate : P_aggregate
            });
        } else {
          const level = await BankSoal.aggregate([
            { 
              $match: { 
                category_id:{ $in :levels},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false },
                createdBy:{ $eq : auth.username}
              }
            },
            {"$group" : { _id :"$category_id",'count':{$sum:1}}}
          ]);
          const matpel = await BankSoal.aggregate([
            { 
              $match: { 
                category_id:{ $in :levels},
                publisher_id: { $eq: publisher },
                deleted: { $eq: false },
                createdBy:{ $eq : auth.username}
              }},
            {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
          ]);
          const count = await BankSoal.countDocuments({
            category_id:{ $in :levels},
            deleted : { $eq : false },
            publisher_id: { $in : publisher},
            createdBy:{ $eq : auth.username}
          })
          const Databanksoal = await BankSoal.find({ 
            category_id:{ $in :levels},
            deleted : { $eq : false },
            publisher_id: { $in : publisher},
            createdBy:{ $eq : auth.username}
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ id : -1})
            return res.status(201).json({
              success : 'true',
              message :'Success',
              data : Databanksoal,
              total : count,
              matpel_id: matpel,
              category_id: level
            });
        }
      } else if(sublevels){
        if (sublevel && matpel_id) {
          const level = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                matpel_id: { $in: matapelajaran},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false },
                createdBy:{ $eq : auth.username}
              }
            },
            {"$group" : { _id :"$category_id",'count':{$sum:1}}}
          ]);
          const Sublevel = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                matpel_id: { $in: matapelajaran},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false },
                createdBy:{ $eq : auth.username}
              }
            },
            {"$group" : { _id :"$sub_category_id",'count':{$sum:1}}}
          ]);
          const matpel = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                publisher_id: { $eq: publisher },
                deleted: { $eq: false },
                createdBy:{ $eq : auth.username}
              }},
            {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
          ]);

          const count = await BankSoal.countDocuments({
            sub_category_id:{ $in :sublevels},
            matpel_id: { $in: matapelajaran},
            deleted : { $eq : false },
            publisher_id: { $in : publisher},
            createdBy:{ $eq : auth.username}
          })
          const Databanksoal = await BankSoal.find({ 
            sub_category_id:{ $in :sublevels},
            matpel_id: { $in: matapelajaran},
            deleted : { $eq : false },
            publisher_id: { $in : publisher},
            createdBy:{ $eq : auth.username}
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ id : -1})
            
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count,
            matpel_id: matpel,
            category_id: level,
            sub_category_id: Sublevel
          });
        } else {
          const level = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false },
                createdBy:{ $eq : auth.username}
              }
            },
            {"$group" : { _id :"$category_id",'count':{$sum:1}}}
          ]);
          const Sublevel = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                publisher_id: { $eq: publisher },
                deleted :{ $eq: false },
                createdBy:{ $eq : auth.username}
              }
            },
            {"$group" : { _id :"$sub_category_id",'count':{$sum:1}}}
          ]);
          const matpel = await BankSoal.aggregate([
            { 
              $match: { 
                sub_category_id:{ $in :sublevels},
                publisher_id: { $eq: publisher },
                deleted: { $eq: false },
                createdBy:{ $eq : auth.username}
              }},
            {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
          ]);

          const count = await BankSoal.countDocuments({
            sub_category_id:{ $in :sublevels},
            deleted : { $eq : false },
            publisher_id: { $in : publisher},
            createdBy:{ $eq : auth.username}
          })
          const Databanksoal = await BankSoal.find({ 
            sub_category_id:{ $in :sublevels},
            deleted : { $eq : false },
            publisher_id: { $in : publisher},
            createdBy:{ $eq : auth.username}
          }) 
            .limit(limit)
            .skip(offset)
            .sort({ id : -1})
            return res.status(201).json({
              success : 'true',
              message :'Success',
              data : Databanksoal,
              total : count,
              matpel_id: matpel,
              category_id: level,
              sub_category_id: Sublevel
            });
        }
        
       
      }else if (matpel_id) {
        console.log('ada matpel')
        const level = await BankSoal.aggregate([
          { 
            $match: { 
              publisher_id: { $eq: publisher },
              matpel_id: { $eq: matpel_id},
              deleted :{ $eq: false },
              createdBy:{ $eq : auth.username}
            }
          },
          {"$group" : { _id :"$category_id",'count':{$sum:1}}}
        ]);
        const matpel = await BankSoal.aggregate([
          { 
            $match: { 
              publisher_id: { $eq: publisher },
              deleted: { $eq: false },
              createdBy:{ $eq : auth.username}
            }},
          {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
        ]);
        const count = await BankSoal.countDocuments({
          matpel_id:{ $in :matapelajaran},
          deleted : { $eq : false },
          publisher_id: { $eq: publisher },
          createdBy:{ $eq : auth.username}
        })
        const Databanksoal = await BankSoal.find({ 
          matpel_id:{ $in :matapelajaran},
          deleted : { $eq : false },
          publisher_id: { $eq: publisher },
          createdBy:{ $eq : auth.username}
        }) 
          .limit(limit)
          .skip(offset)
          .sort({ id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total : count,
            matpel_id: matpel,
            category_id: level
          });
      } else {
        const level = await BankSoal.aggregate([
          { 
            $match: { 
              publisher_id: { $eq: publisher },
              deleted :{ $eq: false },
              createdBy:{ $eq : auth.username}
            }
          },
          {"$group" : { _id :"$category_id",'count':{$sum:1}}}
        ]);
        const matpel = await BankSoal.aggregate([
          { 
            $match: { 
              publisher_id: { $eq: publisher },
              deleted: { $eq: false },
              createdBy:{ $eq : auth.username}
            }},
          {"$group" : { _id :"$matpel_id",'count':{$sum:1}}}
        ]);
        const count = await BankSoal.countDocuments({
          publisher_id:{ $eq :publisher},
          deleted : { $eq : false },
          createdBy:{ $eq : auth.username}
        });
        
        const Databanksoal = await BankSoal.find({
          publisher_id: { $eq: publisher },
          deleted : { $eq : false },
          createdBy:{ $eq : auth.username}
        })
          .limit(limit)
          .skip(offset)
          .sort({ id : -1})
          return res.status(201).json({
            success : 'true',
            message :'Success',
            data : Databanksoal,
            total: count,
            matpel_id: matpel,
            category_id: level
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


/**
 * Search
 */

router.get('/search', async (req, res)=> {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let matpel_id = req.query.matpel;
  let matapelajaran = matpel_id ? matpel_id.split(',') : null
  let level = req.query.level;
  let levels = level?  level.split(',') : null
  let publisher = req.auth.accountkey;
  let sort = req.query.by || 'DESC';
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
 
  const count = await BankSoal.countDocuments({
    matpel_id:{ $in :matapelajaran},
    deleted : { $eq : false },
    publisher_id: { $in : publisher}
  })
  const Databanksoal = await BankSoal.find({ 
    matpel_id:{ $in :matapelajaran},
    deleted : { $eq : false },
    publisher_id: { $in : publisher}
  }) 
    .limit(limit)
    .skip(offset)
    .sort({ id : -1})
    return res.status(201).json({
      success : 'true',
      message :'Success',
      data : Databanksoal,
      total : count,
      matpel_id: matpel,
      category_id: level
    });
})
module.exports	=	router;