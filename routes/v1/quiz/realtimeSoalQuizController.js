'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();

/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.post('/',async (req, res) => {
  let realtimeSoal = res.io 
  realtimeSoal.emit('show_question',req.body.soal)
  return res.status(201).json({
    success : 'true',
    message :'Success di Trigger',
  });
});


router.post('/show-nilai', async(req, res)=> {
  let realtimeSoal = res.io 
  console.log('ini real socet show nilai' + req.body.quiz_id)
  realtimeSoal.emit('show_nilai',req.body.quiz_id)
  return res.status(201).json({
    success : 'true',
    message :'Success di Trigger',
  });
})
module.exports	=	router;