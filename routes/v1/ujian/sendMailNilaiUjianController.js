'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const {check, validationResult} = require('express-validator')
const MailService = require('../../../service/ujian/SendMailNilaiAdmin')
const moment = require('moment')
moment.locale('id')
/**
* Send a Mail 
* Point Quiz
* @request body of Object type
*/

router.post('/', async (req, res) => {
  try {
    let data = req.body
    let RealtimeSocket = res.io; // realtime socket
    data.map(async element =>{
      const info = { email: element.email }
      const name = element.nama_peserta ? element.nama_peserta : '-'
      const nama_peserta = name !== '-' ? name[0].toUpperCase() + name.slice(1) : '-';
      console.log(nama_peserta);
      let dataNilai = {
              title:"Hasil " + element.judul_ujian,
              email: element.email,
              nama_peserta: nama_peserta,
              judul_ujian: element.judul_ujian,
              sesi_ujian: element.sesi_ujian,
              penyelenggara: element.penyelenggara,
              waktu_pelakasaan: moment(element.start_date).format("dddd, DD MMMM YYYY") + "("+element.times+' s/d '+element.end_times+")",
              skor: element.skor
            }
      await MailService.SendMailNilaiUjian(dataNilai, element.email)
      RealtimeSocket.emit('email_sent', { info })
    })
    console.log(`All async tasks complete!`)
    return res.status(200).json({
      success: 'true',
      message: 'sending email'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

router.post('/sesi-ujian', async (req, res) => {
  try {
    let data = req.body
    let RealtimeSocket = res.io;
    data.map(async element =>{
      const info = { email: element.email }
      const name = element.nama_peserta ? element.nama_peserta : '-'
      const nama_peserta = name !== '-' ? name[0].toUpperCase() + name.slice(1) : '-';
      console.log(nama_peserta);
      let dataNilai = {
              title:"Hasil " + element.judul_ujian+ " Sesi " + element.sesi_ujian,
              email: element.email,
              nama_peserta: nama_peserta,
              judul_ujian: element.judul_ujian,
              sesi_ujian: element.sesi_ujian,
              durasi_pengerjaan: element.durasi_pengerjaan ? element.durasi_pengerjaan : '-',
              penyelenggara: element.penyelenggara,
              waktu_pelakasaan: moment(element.start_date).format("DD MM YYYY") + "("+element.times+' s/d '+element.end_times+")",
              jumlahsoal: element.jumlah_soal,
              skor: element.skor,
              jawaban_benar: element.jawaban_benar || '-',
              jawaban_salah: element.jawaban_salah || '-'
            }
      await MailService.SendMailNilaiSesiUjian(dataNilai, element.email)
      RealtimeSocket.emit('email_sent' + element.email, { info })
    })
    console.log(`All async tasks complete!`)
    return res.status(200).json({
      success: 'true',
      message: 'sending email'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});


module.exports	=	router;
