const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { StartUjian } = require('./../../../models/mongoose/StartUjian');
const { JawabanUjian } = require('./../../../models/mongoose/JawabanUjian');
const { MySoalUjian } = require('./../../../models/mongoose/MySoalUjian');
const { Ujian } = require('./../../../models/mongoose/Ujian');
const { SoalUjian } = require('./../../../models/mongoose/Soalujian');
const { JadwalSesiUjian } = require('./../../../models/mongoose/JadwalSesiUjian');
const emitter = require('./../../../listeners/akhiri_ujian')
const moment = require('moment')
moment.locale('id')
/**
 * module function Stop Ujian and Send Email 
 * @request body
 * ujian_id
 * sesi_id
 */
router.post('/', [
    check('ujian_id').exists().withMessage('ujian id required'),
    check('sesi_id').exists().withMessage('sesi id required')
  ], async (req, res) => {
    const auth = req.auth;
    const err = validationResult(req);
    if(!err.isEmpty()){
      return res.status(422).json({
        success: 'false',
        error: err
      });
    } else {
      const ujian_id  = req.body.ujian_id;
      const sesi_id  = req.body.sesi_id;
      try {
        const GetUjian = await Ujian.findById(ujian_id)
        if (GetUjian) {
          const GetSesiUjian = await SoalUjian.findOne({ujian_id: ujian_id, _id: sesi_id})
          if (GetSesiUjian) {
            const getStartUjian= await StartUjian.findOne({ujian_id: ujian_id, sesi_id: sesi_id, user_id :auth.uid});
            if (getStartUjian) {
              const my_soal_ujian  = await MySoalUjian.findOne({ujian_id: ujian_id, sesi_id: sesi_id, user_id :auth.uid});
              const getJadwalSesiUjian = await JadwalSesiUjian.findOne({ujian_id: ujian_id, 'schedule.sesi_id': sesi_id}, {'schedule.$': 1})
              const duration = getJadwalSesiUjian !== undefined && getJadwalSesiUjian.schedule.length > 0 ? parseInt(getJadwalSesiUjian.schedule[0].duration)*60000 : undefined;
              const scorePeserta = await JawabanUjian.aggregate([
                { $match: { ujian_id: { $eq: getStartUjian.ujian_id }, sesi_id: {$eq: getStartUjian.sesi_id}, user_id: {$eq: getStartUjian.user_id} } },
                { "$group": {
                  _id: {"soal_id": "$soal_id"},
                  "jawaban": {"$first": "$jawaban"}
                }}
              ])
              
              let Benar = 0;
              let Point = 0;
              let Salah = 0;
              let totalSoal = my_soal_ujian.soals.length;
              
              scorePeserta.forEach(element => {
                let info = element.jawaban;
                if (info.benar === true) {
                  Point += info.point
                  Benar++;
                } else if(info.benar===false){
                  Salah ++;
                }
              });
              let info = {
                start_time: getStartUjian.start_time,
                end_time: getStartUjian.end_time ? getStartUjian.end_time : null
              }
              if(getStartUjian.end_time === null){
                let endStartUjian = {
                  show_nilai : true,
                  nilai : Point,
                  end_time : new Date()
                }
                await getStartUjian.updateOne(endStartUjian);
                info.end_time = endStartUjian.end_time;
              }
              const name = auth.name ? auth.name : '-';
              const nama_peserta = name !== '-' ? name[0].toUpperCase() + name.slice(1) : '-';

              const diff = new Date(info.end_time).getTime() - new Date(getStartUjian.start_time).getTime()
              let durasi = duration ? diff < duration ? diff : duration : diff;
              const hh = Math.floor(durasi / 1000 / 60 / 60);
              durasi -= hh * 1000 * 60 * 60;
              const mm = Math.floor(durasi / 1000 / 60);
              durasi -= mm * 1000 * 60;
              const ss = Math.floor(durasi / 1000);
              durasi -= ss * 1000;
              let dataNilai = {
                title: GetUjian.judul_ujian,
                email: auth.email,
                nama_peserta: nama_peserta !== '-' ? nama_peserta : auth.email,
                phone_number: auth.phoneNumber ? auth.phoneNumber: '-',
                judul_ujian: GetUjian.judul_ujian, //+ ' / ' + GetSesiUjian.sesi_ujian,
                category_ujian: GetUjian.category_ujian,
                penyelenggara: GetUjian.penyelenggara,
                waktu_pelakasaan: moment(getStartUjian.start_time).format("dddd, DD MMMM YYYY HH:mm"),
                durasi_pengerjaan: hh > 0 ? hh + ' jam ' + mm + ' menit ' + ss + ' detik' : mm > 0 ? mm + ' menit ' + ss + ' detik' : ss + ' detik',
                jumlahsoal:totalSoal,
                skor:(Point/totalSoal*100).toFixed(1),
                jawaban_benar:Benar,
                jawaban_salah:Salah
              }

              if (GetUjian.metode_penilaian =='DEFAULT' || GetUjian.metode_penilaian =='NORMAL') {
                if (GetUjian.type_ujian === 'MANDIRI') { // && category_ujian ==='CPNS
                  emitter.emit('hasilujianmandiri', dataNilai);
                } else {
                  emitter.emit('hasilujian', dataNilai); //default
                }
              }

              return res.status(200).json({
                success: 'true',
                message: 'akhiri ujian '+ ujian_id + ' success',
                info: info,
                data: {
                  message: 'Mail Sent '+auth.email
                }
              })
            } else {
              return res.status(404).json({
                success: 'false',
                error: 'Not Found',
                message: 'Start Ujian not found'
              })
            }
          } else {
            return res.status(404).json({
              success: 'false',
              message: 'Data Sesi Ujian tidak ditemukan'
            })  
          }
        } else {
          return res.status(404).json({
            success: 'false',
            message: 'Data Ujian tidak ditemukan'
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
module.exports = router;