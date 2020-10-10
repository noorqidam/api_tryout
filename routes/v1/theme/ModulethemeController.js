'use strict'
const	express  	=	require('express');
const { Moduletheme } = require('../../../models/mongoose/Moduletheme')
const	router 		= 	express.Router();

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',async (req, res) => {
  try {
    var id = mongoose.Types.ObjectId();
    let module_id = req.body.module_id;
    let theme_id = '' // ambil id dari yang terakhir
    let theme_name = req.theme_name;
    let paket_soal = req.paket_soals;
    let publish = req.body.publish;

    const SaveModuleTheme = new  Moduletheme({
      _id:id,
      module_id: module_id,
      theme_id: element.id,
      theme_name: theme_name,
      paket_soal:paket_soal,
      publish: publish,
      createdAt: new Date().toString()
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/**
* Update the specified resource in storage.
*
* @param  int  id
* @return Response
*/

router.put('/:id',async (req, res) => {
  
});

/**
* Remove the specified resource from storage.
*
* @param  int  id
*/
router.delete('/:id',async (req, res) => {
  
});


module.exports	=	router;