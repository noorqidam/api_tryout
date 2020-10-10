const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const { JawabanUjian } = require('../../../models/mongoose/JawabanUjian')
const { SoalUjian } = require('./../../../models/mongoose/Soalujian');
const { MySoalUjian } = require('./../../../models/mongoose/MySoalUjian');
const { Ujian } = require('./../../../models/mongoose/Ujian');
const mongoose = require('mongoose');
const {NilaiUjian} = require('../../../models/mongoose/NilaiUjian');

router.get('/', [
  check('ujian_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    const {ujian_id} = req.query
    if (!mongoose.Types.ObjectId.isValid(ujian_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        message: 'Please send a valid objectId ujian_id'
      })
    } else {
      try {
        const getUjian = await Ujian.findOne({ _id:ujian_id, deleted: false })
        if(getUjian){
          const GetSesiUjian = await SoalUjian.find({ujian_id: ujian_id})
          if (GetSesiUjian.length > 0) { 
            console.log('sesi ujian ada'+getUjian._id+GetSesiUjian.length);
            
            const JumlahPeserta = await MySoalUjian.aggregate([
              {$match: { ujian_id: {$eq: getUjian._id}}},
              {"$group": {_id: {sesi_id: "$sesi_id"}, 'count': {$sum:1}}}
            ])
            
            if(JumlahPeserta.length > 0){
              let data = []
              GetSesiUjian.forEach(item => {
                const dataSesi = JumlahPeserta.filter(element => {
                  const sesiId = JSON.parse(JSON.stringify(item._id))
                  const sesi_id = JSON.parse(JSON.stringify(element._id.sesi_id))
                  return sesi_id === sesiId
                })
                console.log(dataSesi);
                
                if (dataSesi.length > 0) {              
                  data.push({
                    sesi_id: item._id,
                    sesi_ujian: item.sesi_ujian,
                    total_peserta: dataSesi[0].count
                  })
                } else {
                  data.push({
                    sesi_id: item._id,
                    sesi_ujian: item.sesi_ujian,
                    total_peserta: 'Belum ada peserta'
                  })
                }
              })
              return res.status(200).json({
                success: 'true',
                judul_ujian: getUjian.judul_ujian,
                data: data
              })
            } else {
              return res.status(404).json({
                success: 'false',
                error: 'Not Found',
                message: 'Peserta tidak di temukan'
              })
            }
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              message: 'Tidak ada ujian esay pada ujian ini'
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
        console.log(error);
        return res.status(500).json({
          success: 'false',
          error: error
        })
      }
    }
  }
});


router.get('/peserta-sesi', [
  check('ujian_id').not().isEmpty().withMessage('required'),
  check('sesi_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    const {ujian_id, sesi_id} = req.query
    if (!mongoose.Types.ObjectId.isValid(ujian_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        message: 'Please sent a valid objectId for ujian_id'
      })
    } else {
      if (!mongoose.Types.ObjectId.isValid(sesi_id)) {
        return res.status(422).json({
          success: 'false',
          err: 'Invalid input',
          message: 'Please sent a valid objectId for sesi_id'
        })
      } else {
        try {
          const GetSesiUjian = await SoalUjian.findOne({ujian_id: ujian_id, _id: sesi_id}).populate('ujian_id', '_id judul_ujian penyelenggara start_date times end_times')
          let data = []
          if (GetSesiUjian) {
            const getPeserta = 	await MySoalUjian.aggregate([
              { $match: { ujian_id: { $eq: GetSesiUjian.ujian_id._id }, sesi_id: { $eq: GetSesiUjian._id } } },
              { "$group":
                  { '_id': { user_id: "$user_id" },
                  "email": {"$first": "$email"},
                  "profile_id": {"$first": "$profile_id"},
                  "soals": {"$first": "$soals"}
              }}
            ]).sort({'email':1})
            
            // const getPeserta = await MySoalUjian.find({ujian_id: GetSesiUjian.ujian_id, sesi_id: GetSesiUjian._id})
            const getStatusReview = await  JawabanUjian.find({sesi_id: sesi_id}).populate('soal_id', 'type_soal')
            const getNilaiAkhir = await NilaiUjian.find({ujian_id: ujian_id, sesi_id: sesi_id})
            
            if (getPeserta) { 
              if (getPeserta.length > 0) {
                getPeserta.forEach(async item => {
                  const total_soal_all = item.soals.length;
                  let total_soal_esay = 0;
                  let total_soal_pg = 0;
                  item.soals.forEach(soal =>{
                    if(soal.type_soal === 'ESAY'){
                      total_soal_esay += 1
                    } else {
                      total_soal_pg += 1
                    }
                  })
                  const max_point_esay = total_soal_esay * 100;
                  const max_point_pg = total_soal_pg;
                  const cek_nilai_akhir = getNilaiAkhir.filter(y=> {
                    return y.user_id === item._id.user_id
                  }) 
                  let isReviewed = [];
                  let is_reviewed = false;
                  let pointEsay = 0;
                  let pointPg = 0;
                  let countReviewed = 0;
                  let totalJawabEsay = 0;
                  let totalJawabPg = 0;
                  let name = null;
                  if (getStatusReview.length > 0) {
                    const jawabanPerUser = getStatusReview.filter(x=>{
                      return x.user_id === item._id.user_id
                    })
                    if (jawabanPerUser.length > 0) {
                      jawabanPerUser.forEach((element, index) => {
                        if (name === null) {
                          if (element.name !== null && element.name !== undefined) {
                            name = element.name
                          }
                        }
                        if (element.soal_id.type_soal === 'PG') {
                          pointPg += element.jawaban.point;
                          totalJawabPg += 1;
                          isReviewed.push(element.jawaban.is_verified)
                        } else {
                          if (element.jawaban.is_verified === true) {
                            isReviewed.push(element.jawaban.is_verified);
                            countReviewed += 1;
                            totalJawabEsay += 1;
                            pointEsay += element.jawaban.point;
                          } else {
                            isReviewed.push(element.jawaban.is_verified);
                            totalJawabEsay += 1;
                          }
                        }
                        
                        if(jawabanPerUser.length - 1 === index){
                          const cek_is_review = isReviewed.filter(x=>{
                            return x === false;
                          })
                          if(cek_is_review.length === 0 && cek_nilai_akhir.length > 0){
                            is_reviewed = true;
                          }
                        }
                      })
                    } else {
                      if (cek_nilai_akhir.length > 0) {
                        is_reviewed = true;
                      }
                    }
                  } else {
                    if (cek_nilai_akhir.length > 0) {
                      is_reviewed = true;
                    }
                  }                  
                  data.push({
                    user_id: item._id.user_id,
                    email: item.email || item.user_id,
                    nama_peserta: name ? name: item.email || item.user_id,
                    penyelenggara: GetSesiUjian.ujian_id.penyelenggara,
                    start_date: GetSesiUjian.ujian_id.start_date,
                    times: GetSesiUjian.ujian_id.times,
                    end_times: GetSesiUjian.ujian_id.end_times,
                    isReviewed: is_reviewed,
                    total_soal_all: total_soal_all,
                    skor_esay: total_soal_esay === 0 ? 'tidak ada soal esay' : parseFloat((pointEsay/max_point_esay*100).toFixed(2)),
                    skor_pg: total_soal_pg === 0 ? 'tidak ada soal pg' : parseFloat((pointPg/max_point_pg*100).toFixed(2)),
                    max_point_esay: total_soal_esay === 0 ? 'tidak ada soal esay' : max_point_esay,
                    max_point_pg: total_soal_pg === 0 ? 'tidak ada soal pg' : max_point_pg,
                    point_esay: total_soal_esay === 0 ? 'tidak ada soal esay' : pointEsay,
                    point_pg: total_soal_pg === 0 ? 'tidak ada soal pg' : pointPg,
                    total_soal_esay: total_soal_esay === 0 ? 'tidak ada soal esay' : total_soal_esay,
                    total_soal_pg: total_soal_pg === 0 ? 'tidak ada soal pg' : total_soal_pg,
                    dijawab_esay: total_soal_esay === 0 ? 'tidak ada soal esay' : totalJawabEsay,
                    dijawab_pg: total_soal_pg === 0 ? 'tidak ada soal pg' : totalJawabPg,
                    jawaban_di_review: total_soal_esay === 0 ? 'tidak ada soal esay' : countReviewed,
                    nilai_akhir: cek_nilai_akhir.length>0 ? cek_nilai_akhir[0].nilai_akhir : 'Belum dinilai'
                  })
                })
                return res.status(200).json({
                  success: 'true',
                  data: data,
                  ujian: GetSesiUjian.ujian_id,
                  sesi_ujian: GetSesiUjian.sesi_ujian
                })
              } else {
                return res.status(404).json({
                  success: 'false',
                  error: 'Not Found',
                  message: 'Tidak ada data peserta pada sesi ujian ini'
                })
              }
            } else {
              return res.status(404).json({
                success: 'false',
                error: 'Not Found',
                message: 'MysoalUjian error'
              })
            }
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              message: 'Sesi ujian of this Ujian does not exist'
            })
          }
        } catch (error) {
          return res.status(500).json({
            success: 'false',
            error: error
          })
        }
      }
    }
  }
});

router.get('/jawaban-peserta', [
  check('ujian_id').not().isEmpty().withMessage('required'),
  check('sesi_id').not().isEmpty().withMessage('required'),
  check('user_id').not().isEmpty().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {
    // console.log('no error');
    const {ujian_id, sesi_id, user_id} = req.query;
    if (!mongoose.Types.ObjectId.isValid(ujian_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        message: 'Please input a valid ObjectId of ujian_id'
      })
    } else {
      if (!mongoose.Types.ObjectId.isValid(sesi_id)) {
        return res.status(422).json({
          success: 'false',
          err: 'Invalid input',
          message: 'Please input a valid ObjectId of sesi_id'
        })
      } else {     
        try {
          // console.log('try enter');
          const GetMySoalUjian = await MySoalUjian.findOne({ujian_id: ujian_id, sesi_id: sesi_id, user_id:user_id}).populate('ujian_id', '_id judul_ujian').populate('sesi_id', '_id sesi_ujian')
          if (GetMySoalUjian) {
            const total_soal = GetMySoalUjian.soals.length;
            let total_soal_esay = 0;
            let total_soal_pg = 0;
            GetMySoalUjian.soals.forEach(item =>{
              if(item.type_soal === 'ESAY'){
                total_soal_esay += 1
              } else {
                total_soal_pg += 1
              }
            })
            const max_point_pg = total_soal_pg;
            const max_point_esay =  total_soal_esay * 100;
            const nilai_sesi = await NilaiUjian.findOne({ujian_id: GetMySoalUjian.ujian_id, sesi_id: GetMySoalUjian.sesi_id, user_id: GetMySoalUjian.user_id})
            const is_aprooved = nilai_sesi ? true : false;
            let is_reviewed = false;
            let point_pg = 0;
            let point_esay = 0;
            let total_jawaban_esay = 0;
            let total_jawaban_pg = 0;
            const JawabanPeserta = await JawabanUjian.aggregate([
              { '$match': { 'ujian_id': GetMySoalUjian.ujian_id._id, 'sesi_id': GetMySoalUjian.sesi_id._id, 'user_id': user_id } },
              { '$group': { _id: { soal_id: "$soal_id"},
                'ujian_id': {'$first': '$ujian_id'},
                'sesi_id': {'$first': '$sesi_id'},
                'user_id': {'$first': '$user_id'},
                'email': {'$first': '$email'},
                'name': {'$first': '$name'},
                'jawaban': {'$first': '$jawaban'}
              } }
            ])
            .lookup({
              from: 'banksoals',
                let: {ujianId: '$_id.soal_id'},
                pipeline: [
                  {$match: {$expr: { $eq: ['$_id', '$$ujianId']}}},
                  {$project: {'type_soal': 1, 'soal_text': 1, 'soal_image': 1, 'soal_video': 1, 'category_id': 1, 'matpel_id': 1, 'publisher_id': 1, 'publish': 1, 'deleted': 1, 'createdBy': 1 }}
                ],
                as: 'soals'
            })
            .sort({'_id.soal_id': 1})
            if(JawabanPeserta){
              if(JawabanPeserta.length > 0){
                let dataJawaban = [];
               
                
                JawabanPeserta.forEach((item, index) => {
                  let isReviewed = true;
                  if(item.soals[0].type_soal === 'ESAY') {
                    total_jawaban_esay += 1;

                    if(item.jawaban.is_verified === true){
                      isReviewed = true;
                      point_esay += item.jawaban.point
                    } else {
                      isReviewed = false;
                    }
                  } else {
                    total_jawaban_pg += 1;
                    point_pg += item.jawaban.point;
                  }
                  
                  dataJawaban.push({
                    soal_id: item._id.soal_id,
                    soal_text: item.soals[0].soal_text,
                    type_soal: item.soals[0].type_soal,
                    soal_image: item.soals[0].soal_image ? item.soals[0].soal_image : null,
                    jawaban_text: item.jawaban.jawaban_text,
                    point: item.jawaban.point ? item.jawaban.point : item.jawaban.point === 0 ? item.jawaban.point : 0,
                    comment: item.jawaban.comments ? item.jawaban.comments : null,
                    jawaban_image: item.jawaban.jawaban_image ? item.jawaban.jawaban_image : null,
                    reviewer: item.soals[0].type_soal === 'PG' ? 'Soal PG' : item.jawaban.point ? item.jawaban.reviewer ? item.jawaban.reviewer : 'reviewer is not recorded': 'Belum di Review',
                    isReviewed: isReviewed,
                    photo:item.photo,
                    attr: item
                  })
                  
                  if(JawabanPeserta.length - 1 === index){
                    const cekIsReviewed = dataJawaban.filter(element => {
                      return element.isReviewed == false
                    })
                    if(cekIsReviewed.length>0){
                      is_reviewed = false
                    } else {
                      is_reviewed = true
                    }
                  }
                })
                return res.status(200).json({
                  success: 'true',
                  data: dataJawaban,
                  ujian_id: GetMySoalUjian.ujian_id._id,
                  sesi_id: GetMySoalUjian.sesi_id._id,
                  judul_ujian: GetMySoalUjian.ujian_id.judul_ujian,
                  sesi_ujian: GetMySoalUjian.sesi_id.sesi_ujian,
                  user_id: GetMySoalUjian.user_id,
                  email: GetMySoalUjian.email,
                  isReviewed: is_reviewed,
                  total_soal: total_soal,
                  total_soal_esay: total_soal_esay > 0 ? total_soal_esay : 'Tidak ada soal esay',
                  soal_esay_dijawab: total_soal_esay > 0 ? total_jawaban_esay : 'Tidak ada soal esay',
                  point_esay: total_soal_esay > 0 ? point_esay : 'Tidak ada soal esay',
                  max_point_esay: total_soal_esay > 0 ? max_point_esay : 'Tidak ada soal esay',
                  total_soal_pg: total_soal_pg > 0 ? total_soal_pg : 'Tidak ada soal pg',
                  soal_pg_dijawab: total_soal_pg > 0 ? total_jawaban_pg : 'Tidak ada soal pg',
                  point_pg: total_soal_pg > 0 ? point_pg : 'Tidak ada soal pg',
                  max_point_pg: total_soal_pg > 0 ? max_point_pg : 'Tidak ada soal pg',
                  score_esay: total_soal_esay > 0 ? parseFloat((point_esay/max_point_esay*100).toFixed(2)) : 'Tidak ada soal esay',
                  score_pg: total_soal_pg > 0 ? parseFloat((point_pg/max_point_pg*100).toFixed(2)) : 'Tidak ada soal pg',
                  is_aprooved: is_aprooved,
                  nilai_sesi: nilai_sesi ? nilai_sesi.nilai_akhir : 'Belum dinilai'
                })
              } else {
                console.log('{\n  error: Not Found,\n  message: User mengikuti ujian tanpa menjawab\n}');
                return res.status(200).json({
                  success: 'true',
                  data: [],
                  ujian_id: GetMySoalUjian.ujian_id._id,
                  sesi_id: GetMySoalUjian.sesi_id._id,
                  judul_ujian: GetMySoalUjian.ujian_id.judul_ujian,
                  sesi_ujian: GetMySoalUjian.sesi_id.sesi_ujian,
                  user_id: GetMySoalUjian.user_id,
                  email: GetMySoalUjian.email,
                  isReviewed: true,
                  total_soal: total_soal,
                  total_soal_esay: total_soal_esay > 0 ? total_soal_esay : 'Tidak ada soal esay',
                  soal_esay_dijawab: total_soal_esay > 0 ? total_jawaban_esay : 'Tidak ada soal esay',
                  point_esay: total_soal_esay > 0 ? point_esay : 'Tidak ada soal esay',
                  max_point_esay: total_soal_esay > 0 ? max_point_esay : 'Tidak ada soal esay',
                  total_soal_pg: total_soal_pg > 0 ? total_soal_pg : 'Tidak ada soal pg',
                  soal_pg_dijawab: total_soal_pg > 0 ? 0 : 'Tidak ada soal pg',
                  point_pg: total_soal_pg > 0 ? 0 : 'Tidak ada soal pg',
                  max_point_pg: total_soal_pg > 0 ? max_point_pg : 'Tidak ada soal pg',
                  score_esay: total_soal_esay > 0 ? parseFloat((0/max_point_esay*100).toFixed(2)) : 'Tidak ada soal esay',
                  score_pg: total_soal_pg > 0 ? parseFloat((0/max_point_pg*100).toFixed(2)) : 'Tidak ada soal pg',
                  is_aprooved: is_aprooved,
                  nilai_sesi: nilai_sesi ? nilai_sesi.nilai_akhir : 'Belum dinilai'
                })
              }
            } else {
              return res.status(404).json({
                success: 'false',
                err: 'Not Found',
                message: 'Query Error'
              })
            }
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              message: 'Sesi ujian of this Ujian does not exist'
            })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({
            success: 'false',
            error: error
          })
        }
      }
    }
  }
  
});

router.post('/', [
  check('ujian_id').not().isEmpty().withMessage('required'),
  check('sesi_id').not().isEmpty().withMessage('required'),
  check('soal_id').not().isEmpty().withMessage('required'),
  check('point').not().isEmpty().withMessage('required')
], async (req, res) => {
   const err = validationResult(req);
   if(!err.isEmpty()){
     return res.status(422).json({
       success: 'false',
       error: err
     })
   } else {
    //  console.log('else');
     
     const {soal_id, point, comment, user_id} = req.body;
     const {ujian_id, sesi_id} = req.query;
     if (!mongoose.Types.ObjectId.isValid(ujian_id)) {
      return res.status(422).json({
        success: 'false',
        err: 'Invalid input',
        message: 'Please input a valid ObjectId of ujian_id'
      })
    } else {
      if (!mongoose.Types.ObjectId.isValid(sesi_id)) {
        return res.status(422).json({
          success: 'false',
          err: 'Invalid input',
          message: 'Please input a valid ObjectId of sesi_id'
        })
      } else { 
        try {
          //  console.log('Try');
           
           const GetMyUjian = await MySoalUjian.findOne({ujian_id: ujian_id, sesi_id: sesi_id, user_id: user_id})
          //  console.log(GetMyUjian);
           
           if (GetMyUjian) {
            const JawabanEsayUjian = await  JawabanUjian.findOne({ujian_id: GetMyUjian.ujian_id, sesi_id: GetMyUjian.sesi_id, user_id: GetMyUjian.user_id, soal_id: soal_id})
            // console.log(JawabanEsayUjian);
            
            const isnotpg = GetMyUjian.soals.filter(item=> {
              if(item.type_soal === 'ESAY' && item._id == soal_id){ 
                return true
              }
              return false
            })
            
            if (isnotpg.length > 0) {
              if (JawabanEsayUjian) {
                const NilaiJawaban = {
                  jawaban:{
                    _id: JawabanEsayUjian.jawaban._id,
                    soal_id: JawabanEsayUjian.jawaban.soal_id,
                    is_verified: true,
                    jawaban_text: JawabanEsayUjian.jawaban.jawaban_text,
                    point: point,
                    comments: comment || '',
                    reviewer: req.auth.username
                  }
                }
                
                const info = await JawabanEsayUjian.updateOne(NilaiJawaban);
                return res.status(201).json({
                  success: 'true',
                  data: {
                    updated: NilaiJawaban.jawaban,
                    info:info
                  }
                })
              } else {
                return res.status(404).json({
                  success: 'false',
                  error: 'Not Found',
                  message: 'Jawaban Not Found'
                })
              }
            } else {
              return res.status(404).json({
                success: 'false',
                error: 'Not Esay',
                message: 'Type soal bukan ESAY'
              })
            }
            
           } else {
             return res.status(404).json({
               success: 'false',
               error: 'Not Found',
               message: 'The user data is not exist'
             })
           }
         } catch (error) {
           console.log(error)
           return res.status(500).json({
             success: 'false',
             error: error
           })
         }
      }
    }
   }
});
module.exports = router;
