'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Profile } = require('../../../models/mongoose/profile')
const { check, validationResult } = require('express-validator');


/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/',async (req, res) => {
  let auth = req.auth
  try {
    const GetProfileSchool = await Profile.findOne({ user_id : auth.uid})
    if (GetProfileSchool) {
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data : GetProfileSchool
      });
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Data Profile Tidak Di Temukan'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
* email:{ type: String},
    school: { type: String },
    kelas: { type: String},
    sub_kelas : { type: String},
    photo:{ type: String },
    jenis_kelamin : { type: String},
    publisher_id: { type: String },
*/

router.post('/',[
  check('school').not().isEmpty().withMessage('require'),
  check('jenis_kelamin').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let auth = req.auth
    try {
      const GetProfileSchool = await Profile.findOne({ user_id : auth.uid})
      if (GetProfileSchool) {
        GetProfileSchool.school = req.body.school
        GetProfileSchool.kelas = req.body.kelas
        GetProfileSchool.sub_kelas = req.body.sub_kelas 
        GetProfileSchool.jenis_kelamin = req.body.jenis_kelamin
        let infoUpdate  = await GetProfileSchool.save()
        return res.status(200).json({
          success : 'true',
          message :'Berhasil di Update',
          data : infoUpdate
        });
      } else {
        const SaveProfile = new Profile({
          name : auth.name,
          email: req.body.email,
          user_id: auth.uid,
          school : req.body.school,
          kelas: req.body.kelas,
          sub_kelas : req.body.sub_kelas
        })
        let SaveDataProfile =  SaveProfile.save()
        return res.status(201).json({
          success : 'true',
          message :'Berhasil',
          data :SaveDataProfile
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