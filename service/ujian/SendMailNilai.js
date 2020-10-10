"use strict"
const path      =  require('path')
const aws  = require('aws-sdk');
let config  = require('../awsConfig.json')
const sender = 'Edutore.com <no-reply@edutore.com>';
const ses = new aws.SES(config);
const NilaiSesiUjian = path.join(__dirname, '../../views', 'nilai_sesi_ujian');
const NilaiSesiUjianMandiri = path.join(__dirname, '../../views', 'nilai_sesi_ujian_mandiri');
const Email = require('email-templates');
const charset = "UTF-8";

module.exports.SendMailNilaiSesiUjian = async function (data, email){
  if (!email) {
    console.log('email not found');
    return false; //return false if emailUser not Found
  } else {
    console.log('email' + email)
    try {
      
      const RenderEmail = new Email();
      await  RenderEmail.render(NilaiSesiUjian, {
          email : email,
          title: data.title,
          nama_peserta: data.nama_peserta,
          judul_ujian: data.judul_ujian,
          penyelenggara: data.penyelenggara,
          waktu_pelakasaan: data.waktu_pelakasaan,
          durasi_pengerjaan: data.durasi_pengerjaan,
          jumlahsoal:data.jumlahsoal,
          skor: data.skor,
          jawaban_benar:data.jawaban_benar,
          jawaban_salah:data.jawaban_salah
        })
        .then(result => {
          let params = { 
            Source: sender,
            Destination: { 
              ToAddresses: [ email ],
            },
            Message: {
              Subject: { Data: 'NILAI UJIAN',  Charset: charset },
              Body: {
                Html: {
                  Data: result,
                  Charset: charset
                }
              }
            }
          };
          //Try to send the email.
          ses.sendEmail(params, function(err, data) {
            // If something goes wrong, print an error message.
            if(err) {
              console.log(err.message);
              return false;
            } else {
              console.log("Email sent! Message ID: ", data.MessageId);
              return true;
            }
          });
  
        })
        .catch( err => {
          console.log(err);
          return false;
        });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports.SendMailNilaiSesiUjianMandiri = async function (data, email){
  if (!email) {
    console.log('email not found');
    return false; //return false if emailUser not Found
  } else {
    console.log('email' + email)
    try {
      
      const RenderEmail = new Email();
      await  RenderEmail.render(NilaiSesiUjianMandiri, {
          email : email,
          title: data.title,
          nama_peserta: data.nama_peserta,
          judul_ujian: data.judul_ujian,
          penyelenggara: data.penyelenggara,
          waktu_pelakasaan: data.waktu_pelakasaan,
          durasi_pengerjaan: data.durasi_pengerjaan,
          jumlahsoal:data.jumlahsoal,
          skor: data.skor,
          jawaban_benar:data.jawaban_benar,
          jawaban_salah:data.jawaban_salah
        })
        .then(result => {
          let params = { 
            Source: sender,
            Destination: { 
              ToAddresses: [ email ],
            },
            Message: {
              Subject: { Data: 'NILAI UJIAN MANDIRI',  Charset: charset },
              Body: {
                Html: {
                  Data: result,
                  Charset: charset
                }
              }
            }
          };
          //Try to send the email.
          ses.sendEmail(params, function(err, data) {
            // If something goes wrong, print an error message.
            if(err) {
              console.log(err.message);
              return false;
            } else {
              console.log("Email sent! Message ID: ", data.MessageId);
              return true;
            }
          });
  
        })
        .catch( err => {
          console.log(err);
          return false;
        });
    } catch (error) {
      console.log(error);
    }
  }
}
