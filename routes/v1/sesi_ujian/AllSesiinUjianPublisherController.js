'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { SoalUjian  } = require('../../../models/mongoose/Soalujian');
const mongoose = require('mongoose')
/**
* Display the specified resource
*
* @param	String/int 	 id
* Detail sesi ujian
*/

router.get('/:id',async (req, res) => {
  let id = req.params.id
  //let publisher = req.auth.accountkey;
  
  try {
    const GetSoalInSesiUjian = await SoalUjian.find({ ujian_id : mongoose.Types.ObjectId(id)})
      .populate({ path :'ujian_id'})
      .sort({ id : -1})
      
    return res.status(200).json({
      success : 'true',
      message :'Data Sesi Ujian Di Temukan',
      data :GetSoalInSesiUjian
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});


module.exports	=	router;