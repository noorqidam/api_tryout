'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { Profile } = require('../../../models/mongoose/profile')

/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let kelas = req.query.kelas
  let auth = req.auth

  try {
   
    if (kelas) {
      const CountDataSiswa = await Profile.countDocuments({ 
        publisher_id:{ $eq :auth.accountkey}, 
        kelas: { $eq: kelas},
      })
      const DataSiswa = await Profile.find({ 
        publisher_id:{ $eq :auth.accountkey}, 
        kelas: { $eq: kelas},
      })
      .limit(limit)
      .skip(offset)
      .sort({ _id : -1})
   
      return res.status(200).json({
        success : 'true',
        message :'Data Siswa Di Temukan',
        data : {
          rows: DataSiswa,
          count : CountDataSiswa
        }
      });
    } else {
      const CountDataSiswa = await Profile.countDocuments({ 
        publisher_id:{ $eq :auth.accountkey}
      })
      const DataSiswa = await Profile.find({ publisher_id:{ $eq :auth.accountkey} })
      .limit(limit)
      .skip(offset)
      .sort({ _id : -1})
   
      return res.status(200).json({
        success : 'true',
        message :'Data Siswa Di Temukan',
        data : {
          rows: DataSiswa,
          count : CountDataSiswa
        }
      });
    }
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

module.exports	=	router;