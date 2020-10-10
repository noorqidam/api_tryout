'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { LoginAcceess } = require('../../../models/mongoose/LoginAccess')

/**
 * Return Data Count Ujian GroupBy Auth n Category
 * @requires auth
 * @body json
 */
router.post('/', async (req,res)=> {
  try {

    const count = await LoginAcceess.countDocuments();
    const UserActivities = await LoginAcceess.find()
      .limit(limit)
      .skip(offset)
      .sort({ _id : -1})

    return res.status(200).json({
      success : 'true',
      message :'Data Di Temukan',
      data : UserActivities,
      count: count
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
})


module.exports = router