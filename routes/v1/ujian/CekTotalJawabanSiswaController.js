const express = require('express');
const router = express.Router();
const { Ujian } = require('./../../../models/mongoose/Ujian');
const { JawabanUjian } = require('./../../../models/mongoose/JawabanUjian');
const { MySoalUjian } = require('./../../../models/mongoose/MySoalUjian');
const mongoose = require('mongoose');

router.get('/', async(req, res) => {
  try {
    const Ujians = await MySoalUjian.aggregate([
      {
        '$group': 
        {
          '_id': {'user_id': '$user_id', 'ujian_id':'$ujian_id'},
          'soals': {'$first':'$soals'}
        }
      }
    ])
    const JawabanPesertas = await JawabanUjian.aggregate([
      {
        '$group': {
          '_id': {'user_id': '$user_id', 'ujian_id': '$ujian_id'},
          'count_jawaban': {'$sum': 1}
        }
      }
    ])
    let data = {
      lebih_dari : [],
      kurang_dari : [],
      sesuai : []
    }
    Ujians.forEach(ujian => {
      const total_soal = ujian.soals.length;
      const countJawaban = JawabanPesertas.filter(jawabanPeserta => {
        const jwb_ujn_id = JSON.parse(JSON.stringify(jawabanPeserta._id.ujian_id))
        const ujn_id = JSON.parse(JSON.stringify(ujian._id.ujian_id))
        return jawabanPeserta._id.user_id == ujian._id.user_id && jwb_ujn_id == ujn_id
      })
      if(countJawaban.length > 0) {
        console.log(countJawaban[0].count_jawaban);
        if (countJawaban.length > 0){
          const count_jawaban = countJawaban[0].count_jawaban
          
          if(count_jawaban > total_soal){
            data['lebih_dari'].push(...countJawaban)
          } else if (count_jawaban < total_soal){
            data['kurang_dari'].push(...countJawaban)
          } else {
            data['sesuai'].push(...countJawaban)
          }
        } else {
          data['kurang_dari'].push({
            "_id": {
              "user_id": ujian._id.user_id,
              "ujian_id": ujian._id.ujian_id
            },
            "count_jawaban": 0
        })
        }
      } else {
        data['kurang_dari'].push({
          "_id": {
              "user_id": ujian._id.user_id,
              "ujian_id": ujian._id.ujian_id
          },
          "count_jawaban": 0
      })
      }
    })
    return res.status(200).json({
      success: 'true',
      data: data,
      Ujians
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
});

router.get('/:ujian_id', async(req, res) => {
  const ujian_id = mongoose.Types.ObjectId(req.params.ujian_id);
  try {
    const Ujians = await MySoalUjian.aggregate([
      {
        '$match': {
          'ujian_id': {
            '$eq': ujian_id
          }
        }
      },
      {
        '$lookup': {
          'from': 'ujians',
          'localField': 'ujian_id',
          'foreignField': '_id',
          'as': 'ujian'
        }
      },
      { '$unwind': { 'path': '$ujian', 'preserveNullAndEmptyArrays': true}},
      {
        '$group': 
        {
          '_id': {'user_id': '$user_id', 'ujian_id':'$ujian_id'},
          'soals': {'$first':'$soals'},
          'email': {'$first':'$email'},
          'ujian': {'$first': '$ujian'}
        }
      }
    ])
    const JawabanPesertas = await JawabanUjian.aggregate([
      {
        '$match': {
          'ujian_id': {
            '$eq': ujian_id
          }
        }
      },
      {
        '$group': {
          '_id': {'user_id': '$user_id', 'ujian_id': '$ujian_id'},
          'email': {'$first': '$email'},
          'user_id': {'$first': '$user_id'},
          'sekolah': {'$first': '$school'},
          'kelas': {'$first': '$kelas'},
          'sub_kelas': {'$first': '$sub_kelas'},
          'count_jawaban': {'$sum': 1},
        }
      }
    ])
    let data = {
      lebih_dari : [],
      kurang_dari : [],
      sesuai : []
    }
    Ujians.forEach(ujian => {
      const total_soal = ujian.soals.length;
      const countJawaban = JawabanPesertas.filter(jawabanPeserta => {
        const jwb_ujn_id = JSON.parse(JSON.stringify(jawabanPeserta._id.ujian_id))
        const ujn_id = JSON.parse(JSON.stringify(ujian._id.ujian_id))
        return jawabanPeserta._id.user_id == ujian._id.user_id && jwb_ujn_id == ujn_id
      })
      if(countJawaban.length > 0) {
        if (countJawaban.length > 0){
          countJawaban[0].ujian = ujian.ujian.judul_ujian;
          const count_jawaban = countJawaban[0].count_jawaban
          
          if(count_jawaban > total_soal){
            data['lebih_dari'].push(...countJawaban)
          } else if (count_jawaban < total_soal){
            data['kurang_dari'].push(...countJawaban)
          } else {
            data['sesuai'].push(...countJawaban)
          }
        } else {
          data['kurang_dari'].push({
            "_id": {
              "user_id": ujian._id.user_id,
              "ujian_id": ujian._id.ujian_id,
              'ujian': ujian.ujian.judul_ujian
            },
            "count_jawaban": 0
        })
        }
      } else {
        data['kurang_dari'].push({
          "_id": {
              "user_id": ujian._id.user_id,
              "ujian_id": ujian._id.ujian_id,
              'ujian': ujian.ujian.judul_ujian
          },
          "count_jawaban": 0
      })
      }
    })
    return res.status(200).json({
      success: 'true',
      data: data
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
});


module.exports = router;