const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { Ujian } = require('../../../models/mongoose/Ujian');
const { SoalUjian } = require('../../../models/mongoose/Soalujian');
const { MySoalUjian } = require('../../../models/mongoose/MySoalUjian');
const { JawabanUjian } = require('../../../models/mongoose/JawabanUjian');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  let auth = req.auth;
  try {
    const GetAllMyUjian = await MySoalUjian.aggregate([
      {'$match': {'user_id': auth.uid}},
      {'$group': {_id: {ujian_id: '$ujian_id', email: '$email', user_id: '$user_id'}}}
    ])
    .lookup({
      from: 'ujians',
        let: {ujianId: '$_id.ujian_id'},
        pipeline: [
          {$match: {$expr: { $eq: ['$_id', '$$ujianId']}}},
          {$project: {'ujian_banner': 1, 'judul_ujian': 1, 'start_date': 1, 'times': 1, 'end_times': 1, '_id': 0}}
        ],
        as: 'ujian'
    })
    .sort({'_id.ujian_id': 1})

    if(GetAllMyUjian.length){
      return res.status(200).json({
        success: 'true',
        data: GetAllMyUjian
      })
    } else {
      return res.status(200).json({
        success: 'true',
        data: [],
        message: 'Tidak ada history ujian'
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
});

router.get('/sesi-ujian', [
  check('ujian_id').exists().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    console.error(err);
    
    return res.status(422).json({
      success: 'false',
      err: err
    })
  } else {    
    let auth = req.auth;
    try {
      const {ujian_id} = req.query;
      const ujianId = mongoose.Types.ObjectId(ujian_id)
      const GetAllMyUjian = await MySoalUjian.aggregate([
        {'$match': {'user_id': auth.uid, 'ujian_id': ujianId}},
        {'$group': {_id: {ujian_id: '$ujian_id', sesi_id: '$sesi_id', email: '$email', user_id: '$user_id'}}}
      ])
      .lookup({
        from: 'ujians',
          let: {ujianId: '$_id.ujian_id'},
          pipeline: [
            {$match: {$expr: { $eq: ['$_id', '$$ujianId']}}},
            {$project: {'ujian_banner': 1, 'judul_ujian': 1, 'start_date': 1, 'times': 1, 'end_times': 1, '_id': 0}}
          ],
          as: 'ujian'
      })
      .lookup({
        from: 'soalujians',
        let:{sesiId: '$_id.sesi_id'},
        pipeline: [
          { "$match": { "$expr": { "$eq": ["$_id", "$$sesiId"] }}},
          { "$project": {'sesi_ujian': 1, '_id': 0}}
        ],
        as: 'sesi'
      })
      .sort({'_id.sesi_id': 1})
      if(GetAllMyUjian.length){
        return res.status(200).json({
          success: 'true',
          data: GetAllMyUjian
        })
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Not Found',
          message: 'Tidak ada history ujian'
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 'false',
        error: error
      })
    }
  }
});


router.get('/detail-sesi-ujian', [
  check('ujian_id').exists().withMessage('required'),
  check('sesi_id').exists().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    console.error(err);
    
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    let auth = req.auth;
    // let auth = {
    //   uid:'5f1b98b4b6d9d105bfb1b75e',
    //   email:"rainazahira12@gmail.com",
    //   name:'rohmat mret'
    // }
    const {ujian_id, sesi_id} = req.query;
    try {
      const getUjian = await Ujian.findOne({_id: ujian_id}).select('_id')
      if (getUjian) {
        const getSesiUjian = await SoalUjian.findOne({ujian_id: ujian_id, _id: sesi_id}).select('_id')
        if (getSesiUjian) {
          const getUjianOfUser = await MySoalUjian.findOne({ujian_id: ujian_id, user_id: auth.uid, sesi_id: sesi_id}).populate('ujian_id', '_id judul_ujian').populate('sesi_id', '_id sesi_ujian')
            if(getUjianOfUser){ 
              const getRatingUjian = await JawabanUjian.aggregate([
                {$match: {ujian_id: {$eq: getUjianOfUser.ujian_id._id}, sesi_id: {$eq: getUjianOfUser.sesi_id._id}, user_id: {$eq: auth.uid}}},
                {'$group': {_id:{sesi_id: '$sesi_id' ,soal_id:'$soal_id'}, 'count': {$sum: 1}, "total_point": {"$sum": "$jawaban.point"}}}
              ]);
              if (getRatingUjian.length) {
                let Arrnilai = getRatingUjian.map(t => t.total_point)
                let nilai = Arrnilai.reduce(function(a, b){return a+b;})
                return res.status(200).json({
                  
                  success: 'true',
                  data: {
                    user_id: getUjianOfUser.user_id || 'No Email Data',
                    email: getUjianOfUser.email || '',
                    ujian_id: getUjianOfUser.ujian_id._id,
                    judul_ujian: getUjianOfUser.ujian_id.judul_ujian,
                    sesi_id: getUjianOfUser.sesi_id._id,
                    sesi_ujian: getUjianOfUser.sesi_id.sesi_ujian,
                    result: {
                      total_soal: getUjianOfUser.soals.length,
                      total_jawab: getRatingUjian.length,
                      total_point: nilai,
                      score: parseFloat((nilai / getUjianOfUser.soals.length * 100).toFixed(2))
                    }
                  }
                })
              } else {
                return res.status(200).json({
                  success: 'true',
                  data: {
                    user_id: getUjianOfUser.user_id || 'No uid Data',
                    email: getUjianOfUser.email || 'No email Data',
                    ujian_id: getUjianOfUser.ujian_id._id,
                    judul_ujian: getUjianOfUser.ujian_id.judul_ujian,
                    sesi_id: getUjianOfUser.sesi_id._id,
                    sesi_ujian: getUjianOfUser.sesi_id.sesi_ujian,
                    result: 'belum mengikuti sesi'
                  }
                })
              }
            } else {
              return res.status(404).json({
                success: 'false',
                error: 'Not Found',
                message: 'User tidak mengikuti ujian ini'
              })
            }
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            message: 'Belum ada sesi ujian'
          })
        }
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Not Found',
          message: 'Ujian tidak ditemukan'
        })
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 'false',
        error: error
      })
    }
  }
});

module.exports = router;
