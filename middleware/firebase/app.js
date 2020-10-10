'use strict'
const FirebaseAdmin = require('../../config/FirebaseAdmin')
//const FirebaseCache = require('../../cache/firebasetoken')

/**
 * Example data verifytoken valid
 * { name: 'rohmat Mret',
  picture:
   'https://lh3.googleusercontent.com/-_hmRqWiJFl4/AAAAAAAAAAI/AAAAAAAAAuY/quRSj25CV4c/photo.jpg',
  iss: 'https://securetoken.google.com/edutore01',
  aud: 'edutore01',
  auth_time: 1585570159,
  user_id: '4vu8oFWk9zfp1ISlm6yDychgxg13',
  sub: '4vu8oFWk9zfp1ISlm6yDychgxg13',
  iat: 1585570163,
  exp: 1585573763,
  email: 'rohmat771@gmail.com',
  email_verified: true,
  firebase:
   { identities: { 'google.com': [Array], email: [Array] },
     sign_in_provider: 'password' },
  uid: '4vu8oFWk9zfp1ISlm6yDychgxg13' }
 */
module.exports = function verifyIdToken(req, res , next){
  if (req.headers['x-access-token']) {
    let token = req.headers['x-access-token'];
    let checkRevoked = true;
    FirebaseAdmin.auth().verifyIdToken(token)
      .then(payload => {
        req.auth = payload;
        //FirebaseCache.setCache(token,payload)
        next()
      })
      .catch(error => {
        if (error.code == 'auth/id-token-revoked') {
          // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
          console.log('Token has been revoked. Inform the user to reauthenticate or signOut() the user');
          return res.status(401).json({
            success:'false',
            message:'Token has been revoked. Inform the user to reauthenticate or signOut() the user',
            data: error
          })
        } else {
          // Token is invalid.
          console.log('token is invalid ' + JSON.stringify(token))
          return res.status(401).json({
            success:'false',
            message:'Token is Invalid',
            data : error
          })
        }
      })
  } else{
    return res.status(401).json({
      success : 'false',
      message :'UnAutheticate'
    });
  }
}