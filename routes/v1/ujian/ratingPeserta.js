const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {SoalUjian} = require('../../../models/mongoose/Soalujian');
const { Ujian } = require('../../../models/mongoose/Ujian');
const {MySoalUjian} = require('./../../../models/mongoose/MySoalUjian')
const {JawabanUjian} = require('../../../models/mongoose/JawabanUjian');

router.post('/', [
  check('ujian_id').not().isEmpty().withMessage('required'),
  check('sesi_id').not().isEmpty().withMessage()
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    return res.status(422).json({
      success: 'false',
      error: err
    });
  } else {
    let ujianId = req.body.ujian_id;
    let sesiId = req.body.sesi_id
    let data = Array()
    try {
      const GetUjian = await Ujian.findOne({ _id : ujianId, deleted: false })
      if(GetUjian){
        const SesiUjian = await SoalUjian.findOne({ujian_id:GetUjian._id, _id: sesiId})
        if(SesiUjian){
          const PesertaUjian = await MySoalUjian.aggregate([
            {
              $match:
                {
                  ujian_id: { $eq: SesiUjian.ujian_id },
                  sesi_id: { $eq: SesiUjian._id }
                }
              },
              {
                $group: 
                  {
                    _id: {"user_id": "$user_id"},
                    "ujian_id": {"$first": "$ujian_id"},
                    "email": {"$first": "$email"},
                    "sesi_id": {"$first": "$sesi_id"},
                    "sesi_ujian": {"$first": "$sesi_ujian"},
                    "soals": { "$first": "$soals"}
                  }
              }
            ])
          const JawabanUjians = await JawabanUjian.aggregate([
            { $match: { ujian_id: { $eq: SesiUjian.ujian_id }, sesi_id: {$eq: SesiUjian._id}} },
            {
              "$group" : 
                { 
                  _id :{  "user_id": "$user_id","type_soal":"$type_soal", "soal_id": "$soal_id" },
                  "name": {"$first": "$name"},
                  "email": {"$first": "$email"},
                  "school": {"$first": '$school'},
                  "kelas": {"$first": '$kelas'},
                  "sub_kelas": {"$first": '$sub_kelas'},
                  "jawaban": {"$first": "$jawaban"}
                }
            }
          ])
          if(PesertaUjian.length){
            PesertaUjian.forEach((result) => {
              const cekIfSoalEsayExist = result.soals.filter(item=>{
                return item.type_soal === 'ESAY'
              })
              let total_soal_pg = 0;
              let total_soal_esay = 0;
              result.soals.forEach( soal => {
                if(soal.type_soal === 'PG'){
                  total_soal_pg += 1;
                } else {
                  total_soal_esay += 1;
                }
              })
              const totalSoal = result.soals.length;

              const checkJawabans = JawabanUjians.filter(item => {
                return item._id.user_id == result._id.user_id
              })
              
              let score_esay = 0;
              let score_pg = 0;
              let answered = 0;
              let pg_answered = 0;
              let essay_answered = 0;
              let nilai = 0;
              if(checkJawabans.length > 0){
                checkJawabans.forEach(item => {
                  if (item._id.type_soal === 'ESAY') {
                    score_esay += item.jawaban.point;
                    answered += 1;
                    essay_answered += 1;
                  } else {
                    score_pg += item.jawaban.point;
                    answered += 1;
                    pg_answered += 1;
                  }
                })
                if(cekIfSoalEsayExist.length > 0) {
                  nilai = (parseFloat((score_pg / total_soal_pg * 100).toFixed(1)) + parseFloat((score_esay / (total_soal_pg * 100) * 100).toFixed(1))) / 2
                } else {
                  nilai = parseFloat((score_pg / total_soal_pg * 100).toFixed(1))
                }
                data.push(
                  {
                    email: result.email,
                    user_id:result._id.user_id,
                    name: checkJawabans[0].name ? checkJawabans[0].name : result.email,
                    nama_sekolah: checkJawabans[0].school ? checkJawabans[0].school : '-',
                    kelas: checkJawabans[0].kelas ? checkJawabans[0].kelas : '-',
                    sub_kelas: checkJawabans[0].sub_kelas ? checkJawabans[0].sub_kelas : '-',
                    totalSoal: totalSoal,
                    total_soal_pg: total_soal_pg,
										total_soal_esay: total_soal_esay,
                    pg_dijawab: pg_answered,
                    essay_dijawab: essay_answered,
                    answered: answered,
                    score_pg: parseFloat((score_pg / total_soal_pg * 100).toFixed(1)),
                    score_esay: cekIfSoalEsayExist.length > 0 ? parseFloat((score_esay / (total_soal_pg * 100) * 100).toFixed(1)) ? parseFloat((score_esay / (total_soal_pg * 100) * 100).toFixed(1)) : 0 : 'Tidak ada Esay',
                    nilai: nilai
                  }
                )
              } else{
                data.push(
                  {
                    email: result.email,
                    user_id:result._id.user_id,
                    name: result.email,
                    nama_sekolah: '-',
                    kelas: '-',
                    sub_kelas: '-',
                    totalSoal: totalSoal,
                    total_soal_pg: total_soal_pg,
                    total_soal_esay: total_soal_esay,
                    pg_dijawab: pg_answered,
                    essay_dijawab: essay_answered,
                    answered: 0,
                    score_pg: 0,
                    score_esay: cekIfSoalEsayExist.length > 0 ? 0 : 'Tidak ada Esay',
                    nilai: nilai
                  }
                )
              }
            })
            data.sort((a, b) => 
								(a.name.toUpperCase() < b.name.toUpperCase()) ? 
								-1 : 
								(a.name.toUpperCase() > b.name.toUpperCase()) ? 
								1 : 0
							)
            return res.status(200).json({
              success: 'true',
              data: data
            });
          } else {
            return res.status(404).json({
              success: 'false',
              error: 'Not Found',
              msg: 'Tidak ada data peserta'
            });
          }
        } else {
          return res.status(404).json({
            success: 'false',
            error: 'Not Found',
            message: 'Sesi ujian not found'
          })
        }
      } else {
        return res.status(404).json({
          success: 'false',
          error: 'Not Found',
          msg: 'Ujian not found'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        error: error
      });
    }
  }
});

module.exports = router;
