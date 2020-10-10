'use strict'
const	express  	=	require('express');
const { ModuleSoal } = require('../../../../models/mongoose/ModuleSoal')
const	router 		= 	express.Router();

/**
* Update the specified resource in storage.
*
* @param  int  id
* @return Response
*/

router.get('/:id',async (req, res) => {
  let id = req.params.id
  try {
    const Soal = await ModuleSoal.find({ paket_soal_id : id})
    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data :Soal
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
* Remove the specified resource from storage.
*
* @param  int  id
*/
router.delete('/:id',async (req, res) => {
  
});


module.exports	=	router;