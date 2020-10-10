'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { PesertaUjian  } = require('../../../models/mongoose/PesertaUjian');
const mongoose = require('mongoose')
/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/:id',async (req, res) => {
  let id = req.params.id
  try {
    const Peserta = await PesertaUjian.findById({ _id : id})
      .populate({ path :'ujian_id'})
      .sort({ id : -1})
      
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :Peserta
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/**
 * Get All Peserta UJian
 */
router.get('/ujian_id/:id',async (req, res) => {
  let id = req.params.id
  try {
    const Peserta = await PesertaUjian.find({ ujian_id : id})
      .populate({ path :'ujian_id'})
      .sort({ id : -1})
      
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :Peserta
    });
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
*/

router.post('/',[
  check('ujian_id').not().isEmpty().withMessage('require'),
  check('email').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    
    try {

      var id = mongoose.Types.ObjectId();
      const Peserta = new PesertaUjian({
        _id: id,
        ujian_id : req.body.ujian_id,
        email: req.body.email
      });

      let info = await Peserta.save();

      return res.status(201).json({
        success : 'true',
        message :'Berhasil Menambah Peserta',
        data : info
      });
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
});


/**
* Remove the specified resource from storage.
* 
* @param  String  id
* @param  String Soalid
*/
router.post('/remove-peserta',async (req, res) => {
  try {
    let id        = req.body._id;
    const Peserta = await PesertaUjian.deleteOne({ _id:id });
    return res.status(200).json({
      success : 'true',
      message :'Berhasil Delete',
      data: Peserta
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});


module.exports	=	router;