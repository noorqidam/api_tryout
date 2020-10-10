const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { NilaiUjian } = require('../../../models/mongoose/NilaiUjian');
const { Ujian } = require('../../../models/mongoose/Ujian');
const { SoalUjian } = require('../../../models/mongoose/Soalujian');
const { MySoalUjian } = require('../../../models/mongoose/MySoalUjian');
const { JawabanUjian } = require('../../../models/mongoose/JawabanUjian');

router.get('/', async(req, res) => {
 	try {
    const Ujians = await Ujian.aggregate([
      {
        '$match': {
          'deleted': { '$eq': false }
        }
      },
      {
        '$lookup': {
          'from': 'mysoalujians',
          'localField': '_id',
          'foreignField': 'ujian_id',
          'as': 'peserta'
        }
      },
      { '$unwind': { 'path': '$peserta', 'preserveNullAndEmptyArrays': true } },
      {
        '$group': 
          {
            '_id': {'ujian_id': '$peserta.ujian_id'},
            'judul_ujian': {'$first': '$judul_ujian'},
            'ujian_slag': {'$first': '$ujian_slag'},
            'ujian_banner': {'$first': '$ujian_banner'},
            'type_ujian': {'$first': '$type_ujian'},
            'is_premium': {'$first': '$is_premium'},
            'is_private': {'$first': '$is_private'},
            'category_ujian': {'$first': '$category_ujian'},
            'penyelenggara': {'$first': '$penyelenggara'},
            'start_date': {'$first': '$start_date'},
            'durasi_soal': {'$first': '$durasi_soal'},
            'end_times': {'$first': '$end_times'},
            'end_date': {'$first': '$end_date'},
            'type_start': {'$first': '$type_start'},
            'description': {'$first': '$description'},
            'price': {'$first': '$price'},
            'publish': {'$first': '$publish'},
            'users_count': {
              '$sum': { '$sum': 1 }
            } 
          }
      },
      {
        '$project': {
            '_id': 0, 'ujian_id': '$_id',
            'judul_ujian': '$judul_ujian',
            'ujian_slag': '$ujian_slag',
            'ujian_banner':'$ujian_banner',
            'type_ujian': '$type_ujian',
            'is_premium':'$is_premium',
            'is_private': '$is_private',
            'category_ujian': '$category_ujian',
            'penyelenggara': '$penyelenggara',
            'start_date': '$start_date',
            'durasi_soal': '$durasi_soal',
            'end_times': '$end_times',
            'end_date': '$end_date',
            'type_start': '$type_start',
            'description': '$description',
            'price': '$price',
            'publish': '$publish',
            'peserta': {
                'total_peserta': '$users_count',
            }
        }
    }
    ])
    return res.status(200).json({
      success: 'true',
      data: Ujians
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
  try {
    const { ujian_id } = req.params;
    const getUjian = await Ujian.findOne({ _id: ujian_id, deleted: false });
    if (getUjian) {
      const getSesiUjian = await SoalUjian.find({ujian_id: ujian_id}).select('-soals');
      if (getSesiUjian) {
        let data = [];
        const jumlahSesi = getSesiUjian.length;
        const pesertas = await MySoalUjian.aggregate([
          { $match: { ujian_id: { $eq:getUjian._id } } },
          { $group: { 
            _id: {user_id: "$user_id"},
            'email': {'$first': '$email'}
            } }
        ]).lookup({
          from: 'profiles',
                let: {userId: '$_id.user_id'},
                pipeline: [
                  {$match: {$expr: { $eq: ['$user_id', '$$userId']}}},
                  {$project: {
                    'createdAt': 0,
                    'updatedAt':0
                  }}
                ],
                as: 'profile'
        }).sort('email');

        const getJawaban = await JawabanUjian.aggregate([
          { $match: { ujian_id: { $eq: getUjian._id} } },
          { $group: {
            _id: { 'user_id': "$user_id" },
            'email': { '$first': '$email' },
            'name': { '$first': '$name' },
            'kelas': { '$first': '$kelas' },
            'sub_kelas': { '$first': '$sub_kelas' },
            'school': { '$first': '$school' },
            'subject': { '$first': '$subject' },
            'photo': { '$first': '$photo' }
            }
          }
        ])
        console.log(getJawaban);
        const getNilai = await NilaiUjian.find({ujian_id: ujian_id})
        if (pesertas.length > 0) {
          const promises = pesertas.map(peserta => {
            let sesi = [];
            let is_reviewed = false
            getSesiUjian.forEach(x=> {
              const nilaisesipeserta = getNilai.filter(y=> {
                const y_user_id = JSON.parse(JSON.stringify(y.user_id))
                const peserta_user_id = JSON.parse(JSON.stringify(peserta._id.user_id))
                const y_sesi_id = JSON.parse(JSON.stringify(y.sesi_id))
                const x_sesi_id = JSON.parse(JSON.stringify(x._id))
                
                return y_user_id == peserta_user_id && y_sesi_id == x_sesi_id
              })
              
              if (nilaisesipeserta.length > 0) {
                sesi.push({
                  is_review:true,
                  sesi_id: nilaisesipeserta[0].sesi_id,
                  nilai_pg: nilaisesipeserta[0].nilai_objective,
                  nilai_esay: nilaisesipeserta[0].nilai_esay,
                  nilai_akhir: nilaisesipeserta[0].nilai_akhir
                })
              } else {
                sesi.push({
                  is_review: false,
                  sesi_id: x._id,
                  nilai_pg: '',
                  nilai_esay: '',
                  nilai_akhir: 'Belum diaprooved dan dinilai'
                })
              }
            })
            let nilai_akhir = 0;
            sesi.forEach(x=> {
              if (x.is_review !== false) {
                nilai_akhir += x.nilai_akhir
                is_reviewed = true
              } else {
                is_reviewed = false;
              }
            })

            const filterJawaban = getJawaban.filter( item => {
              return item._id.user_id === peserta._id.user_id
            })
            data.push({
              is_reviewed: is_reviewed,
              user_id: peserta._id.user_id,
              profile_id: peserta.profile.length > 0 ? peserta.profile[0]._id ? peserta.profile[0]._id : filterJawaban.length > 0 ? filterJawaban[0].profile_id ? filterJawaban[0].profile_id : '-' : '-' : filterJawaban.length > 0 ? filterJawaban[0].profile_id ? filterJawaban[0].profile_id : '-' : '-',
              email: peserta.email ? peserta.email : '-',
              name: peserta.profile.length > 0 ? peserta.profile[0].name ? peserta.profile[0].name : filterJawaban.length > 0 ? filterJawaban[0].name ? filterJawaban[0].name : '-' : '-' : filterJawaban.length > 0 ? filterJawaban[0].name ? filterJawaban[0].name : '-' : '-',
              sekolah: peserta.profile.length > 0 ? peserta.profile[0].school ? peserta.profile[0].school : filterJawaban.length > 0 ? filterJawaban[0].school ? filterJawaban[0].school : '-' : '-' : filterJawaban.length > 0 ? filterJawaban[0].school ? filterJawaban[0].school : '-' : '-',
              kelas: peserta.profile.length > 0 ? peserta.profile[0].kelas ? peserta.profile[0].kelas : filterJawaban.length > 0 ? filterJawaban[0].kelas ? filterJawaban[0].kelas : '-' : '-' : filterJawaban.length > 0 ? filterJawaban[0].kelas ? filterJawaban[0].kelas : '-' : '-',
              sub_kelas: peserta.profile.length > 0 ? peserta.profile[0].sub_kelas ? peserta.profile[0].sub_kelas : filterJawaban.length > 0 ? filterJawaban[0].subject ? filterJawaban[0].subject : '-' : '-' : filterJawaban.length > 0 ? filterJawaban[0].subject ? filterJawaban[0].subject : '-' : '-',
              photo: peserta.profile.length > 0 ? peserta.profile[0].photo ? peserta.profile[0].photo : filterJawaban.length > 0 ? filterJawaban[0].photo ? filterJawaban[0].photo : '-' : '-' : filterJawaban.length > 0 ? filterJawaban[0].photo ? filterJawaban[0].photo : '-' : '-',
              jenis_kelamin: peserta.profile.length > 0 ? peserta.profile[0].jenis_kelamin ? peserta.profile[0].jenis_kelamin : '-' : '-',
              sesi: sesi,
              nilai_akhir: nilai_akhir/jumlahSesi
            })
          })
          await Promise.all(promises).then(() => {
            return res.status(200).json({
              success: 'true',
              ujian: getUjian,
              sesi_ujian: getSesiUjian,
              data: data,
              pesertas
            })
          }).catch(err => {
            console.log(err);
            
            return res.status(400).json({
              success: 'false',
              error: err,
            })
          })
        } else {
          return res.status(404).json({
            success: 'false',
            message: 'Tidak ada data peserta ujian',
            error: 'Not Found'
          })
        }
      } else {
        return res.status(404).json({
          success: 'false',
          message: 'Tidak ada sesi ujian pada ujian ini',
          error: 'Not Found'
        })
      }
    } else {
      return res.status(404).json({
        success: 'false',
        message: 'Ujian tidak ditemukan',
        error: 'Not Found'
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

router.post('/',[
  check('ujian_id').exists().withMessage('required'),
  check('sesi_id').exists().withMessage('required'),
  check('nilai_objective').exists().withMessage('required'),
  check('nilai_esay').exists().withMessage('required'),
  check('nilai_akhir').exists().withMessage('required'),
  check('user_id').exists().withMessage('required'),
], async(req, res) => {
  try {
    const { ujian_id, sesi_id, user_id, nilai_akhir, profile_id, school, kelas, sub_kelas, photo, name, email, nilai_objective, nilai_esay, catatan } = req.body;
    let info = '';
    const getUjian = await Ujian.findOne({_id: ujian_id});
    if (getUjian) {
      const getSesiUjian = await SoalUjian.find({_id: sesi_id});
      if (getSesiUjian) {
        const getNilai = await NilaiUjian.findOne({ujian_id: ujian_id, sesi_id: sesi_id, user_id: user_id})
        const update = new NilaiUjian ({
          ujian_id : ujian_id,
          sesi_id : sesi_id,
          profile_id: getNilai ? getNilai.profile_id : profile_id ? profile_id : '-',
          user_id: user_id,
          judul_ujian: getUjian.judul_ujian,
          sesi_ujian: SoalUjian.sesi_ujian,
          school: getNilai ? getNilai.school : school ? school : '-',
          kelas: getNilai ? getNilai.kelas : kelas ? kelas : '-',
          sub_kelas: getNilai ? getNilai.sub_kelas : sub_kelas ? sub_kelas : '-',
          photo: getNilai ? getNilai.photo : photo ? photo : '-',
          name: getNilai ? getNilai.name : name ? name : '-',
          email: email ? email : getNilai ? getNilai.email : email ? email : '-',
          creadtedBy: req.auth.id,
          nilai_objective: nilai_objective,
          nilai_esay: nilai_esay,
          nilai_akhir: parseFloat(nilai_akhir),
          catatan: catatan
        })
        if (getNilai) {
          update._id = getNilai._id
          const nilai = await getNilai.updateOne(update);
          info = nilai;
        } else {
          const nilai = await update.save();
          info = nilai;
        }
        return res.status(200).json({
          success: 'true',
          message: 'Berhasil input nilai',
          info: info
        });
      } else {
        return res.status(404).json({
          success: 'false',
          message: 'Tidak ada sesi ujian pada ujian ini',
          error: 'Not Found'
        })
      }
    } else {
      return res.status(404).json({
        success: 'false',
        message: 'Ujian tidak ditemukan',
        error: 'Not Found'
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: 'false',
      error: error
    })
  }
});

module.exports = router;