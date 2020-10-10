'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const firebase = require('../../../config/FirebaseClient')

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    let Users  = await firebase.auth().signInWithEmailAndPassword(email,password)
      .then(response => {  return response.user })
      .catch(error => {
        console.log(error)
        return error;
      });
      
    if (Users.code =='auth/argument-error') {
      return res.status(500).json({
        success : 'false',
        message :User.message
      });
    } else if(Users.code=='auth/id-token-revoked'){
      return res.status(500).json({
        success : 'false',
        message :User.message
      });
    } else {
    
      return res.status(200).json({
        success : 'true',
        message :'Success Login',
        data : Users,
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