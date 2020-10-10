"use strict"
const path      =  require('path')
const aws  = require('aws-sdk');
let config  = require('../awsConfig.json')
const sender = 'Edutore.com <no-reply@edutore.com>';
const ses = new aws.SES(config);
const NilaiQuiz = path.join(__dirname, '../../views', 'nilai_quiz');
const Email = require('email-templates');
const charset = "UTF-8";

module.exports.SendMailNilaiQuiz = async function (data,email){
  if (!email) {
    console.log('email not found');
    return false; //return false if emailUser not Found
  } else {
    try {
      const RenderEmail = new Email();
      const renderResult = await RenderEmail.render(NilaiQuiz, {
        email : email,
        title: data.title,
        nama_peserta: data.nama_peserta,
        judul_quiz: data.judul_quiz,
        penyelenggara: data.penyelenggara,
        waktu_pelakasaan: data.waktu_pelakasaan,
        jumlahsoal:data.jumlahsoal,
        skor: data.skor,
        jawaban_benar:data.jawaban_benar,
        jawaban_salah:data.jawaban_salah
      })
        
      let params = { 
        Source: sender,
        Destination: { 
          ToAddresses: [ email ],
        },
        Message: {
          Subject: { Data: 'NILAI QUIZ',  Charset: charset },
          Body: {
            Html: {
              Data: renderResult,
              Charset: charset
            }
          }
        }
      };
      const sendMail = new Promise((resolve, reject) => {
        ses.sendEmail(params, (err, result) => {
          if(err){
            console.log(err.stack + '\n');
            reject({email: email, success: 'false' ,err:err.message})
          } else {
            console.log('Email sent! MessageID: '+ result.MessageId + '\n');
            resolve({email: email, success: 'true', messageId: result.MessageId})
          }
        })
      })
      return sendMail.then(result=>{
        return result
      });
    } catch (error) {
      console.log(error);
    }
  }  
}
