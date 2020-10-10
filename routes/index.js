var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {
    title:"report hasil Quiz",
    email:"rohmat771@gmail.com",
    nama_peserta:"rohmatmret",
    judul_quiz:"tryout",
    penyelenggara:"BIN",
    waktu_pelakasaan: new Date(),
    jumlahsoal:30,
    skor:30,
    jawaban_benar:30,
    jawaban_salah:0
  }
  res.render('nilai_quiz', data);
});

module.exports = router;
