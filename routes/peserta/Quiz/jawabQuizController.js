'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, param, validationResult } = require('express-validator');
const { JawabQuiz  } = require('../../../models/mongoose/JawabQuiz');
const { MySoalQuiz } = require('../../../models/mongoose/MySoalQuiz')
const { SoalQuiz } = require('../../../models/mongoose/SoalQuiz')
const { Profile } = require('../../../models/mongoose/profile')
const mongoose = require('mongoose')
//const moment = require('moment')

/**
* Save Jawaban
* quiz_id : 
  sesi_id : { type : Schema.Types.ObjectId, ref: 'Soalujian'},
  jawaban :{ JawabanSchema }
* @param	String/int 	 id
*
*/

router.post('/quiz/:id',[
  check('jawaban_id').not().isEmpty().withMessage('require'),
  check('soal_id').not().isEmpty().withMessage('require'),
  param('id').not().isEmpty().withMessage('id quiz is required')
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let RealtimeSocket = res.io;  //realtime socket
    let auth = req.auth; //get authentication
    let id = req.params.id
    let soal = req.body.soal_id
    let jawaban_id = req.body.jawaban_id

    try {
      const GetProfile = await Profile.findOne({ user_id : auth.uid})
      const GetSoalQuiz = await SoalQuiz.findOne({ quiz_id : id}) 
      let Findsoal = GetSoalQuiz.soals.id(soal)   

      if (Findsoal) {
        if (Findsoal.type_soal ==='ESAY') {
          
          /** Get Save Data Jawaban 
           *  soal_id : { type: Schema.Types.ObjectId, ref: 'Banksoal' },
              jawaban_text: {type: String },
              jawaban_image: {type: String },
              benar: {type: Boolean, required: true},
              point: {type: Number},
              comments: { type: String},
              reviewer:{type: String}
          */
          let jawaban = {
            soal_id : soal,
            jawaban_text: req.body.jawaban_text
          }
          const SaveJawabQuiz = new JawabQuiz({
            _id: _id,
            quiz_id: GetSoalQuiz.quiz_id,
            soal_id: soal,
            email: auth.email,
            name: auth.name,
            school: GetProfile ? GetProfile.school : null,
            kelas: GetProfile ? GetProfile.kelas : null,
            sub_kelas: GetProfile ? GetProfile.sub_kelas : null,
            user_id: auth.uid,
            profile_id: GetProfile ? GetProfile._id : null,
            photo : auth.picture,
            jawaban: jawaban
          });
          //save
          let info = await SaveJawabQuiz.save();

          /** Update Status Answered in MySoalQuiz */
          MySoalQuiz.findOne({ quiz_id : id ,user_id : auth.uid }, function (err, doc){
            if (err) {
              console.log(err)
            } else {
              doc.soals.id(soal).answered = true
              doc.save();
            }
            
          });

          /** Get  Ratting Quiz  for tryout.com*/
          const RattingPeserta = await JawabQuiz.aggregate([
            { $match: { quiz_id: { $eq: GetSoalQuiz.quiz_id }} },
            {"$group" : { _id :{ user_id :"$user_id"},
            'name':{'$first': '$name'},
            'email':{'$first': '$email'},
            'photo':{'$first': '$photo'},
            'count':{$sum:1} ,"total_point": { "$sum": "$jawaban.point" } }},
            { $sort: { "total_point": -1 }}
          ]);

          /**Send Data Via Socket */
          RealtimeSocket.emit('jawab_quiz' + id, {info}) ///for admin
          RealtimeSocket.emit('show_ratting'+id,{RattingPeserta}); //trigger realtime monitoring
          console.log('send message ratting ' + id)
          return res.status(201).json({
            success : 'true',
            message :'Success Save',
            data : info,
            //ratting: RattingPeserta
          });
        } else {
          let J = Findsoal.jawabans.id(jawaban_id)  
          var _id = mongoose.Types.ObjectId();
          //let now = moment().format('YYYY-MM-DD')
          
          /** Get Data History Jawaban  */
          const CheckJawab = await JawabQuiz.findOne({
            email : auth.email,
            quiz_id: GetSoalQuiz.quiz_id,
            soal_id: soal,
            // date : {
            //   $gte: new Date(new Date(now).setHours(0, 0, 0)),
            //   $lt: new Date(new Date(now).setHours(23, 59, 59))
            // }
          });
          /** Check History Jawaban */
          if (CheckJawab) {
            /** Update Status Answered in MySoalQuiz */
            MySoalQuiz.findOne({ quiz_id : id ,user_id : auth.uid }, function (err, doc){
              if (err) {
                console.log(err)
              } else {
                doc.soals.id(soal).answered = true
                doc.save();
              }
            });
            return res.status(403).json({
              success : 'false',
              message :'Anda Telah Menjawab',
              data : CheckJawab
            });
          } else {
            /** Get Save Data Jawaban */
            const SaveJawabQuiz = new JawabQuiz({
              _id: _id,
              quiz_id: GetSoalQuiz.quiz_id,
              soal_id: soal,
              email: auth.email,
              name: auth.name,
              user_id: auth.uid,
              profile_id: GetProfile ? GetProfile._id : null,
              school: GetProfile ? GetProfile.school : null,
              kelas: GetProfile ? GetProfile.kelas : null,
              sub_kelas: GetProfile ? GetProfile.sub_kelas : null,
              photo : auth.picture,
              jawaban: J
            });
            //save
            let info = await SaveJawabQuiz.save();

            /** Update Status Answered in MySoalQuiz */
            MySoalQuiz.findOne({ quiz_id : id ,user_id : auth.uid }, function (err, doc){
              if (err) {
                console.log(err)
              } else {
                doc.soals.id(soal).answered = true
                doc.save();
              }
              
            });

            /** Get Ratting Quiz  for tryout.com*/
            const RattingPeserta = await JawabQuiz.aggregate([
              { $match: { quiz_id: { $eq: GetSoalQuiz.quiz_id }} },
              {"$group" : { _id :{ user_id :"$user_id"}, 
              'name':{'$first': '$name'},
              'email':{'$first': '$email'},
              'photo':{'$first': '$photo'},
              'count':{$sum:1} ,"total_point": { "$sum": "$jawaban.point" } }},
              { $sort: { "total_point": -1 }}
            ]);

            /**Send Data Via Socket */
            RealtimeSocket.emit('jawab_quiz' + id, {info}) ///for admin
            RealtimeSocket.emit('show_ratting'+id,{RattingPeserta}); //trigger realtime monitoring
            console.log('send message ratting ' + id)
            return res.status(201).json({
              success : 'true',
              message :'Success Save',
              data : info,
              //ratting: RattingPeserta
            });
          }
        }
      } else {
        return res.status(404).json({
          success : 'false',
          message :'Data Soal Tidak Di Temukan'
        });
      }
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
  
});

module.exports	=	router;