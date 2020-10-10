'use strict'
const ApiConfig = require('../config/tokenKey');
const jwt       = require('jsonwebtoken');
/**
 * Middleware Auth
 * this is Function to Check Token User Access if dont have a access token return 
 * @param headers [x-access-token]
 */
module.exports = function Valid(req, res , next){
  if (req.headers['x-access-token']) {
    //Check Token
    jwt.verify(req.headers['x-access-token'],ApiConfig.Key ,function (err ,result){
      if (err) {
        console.log('Unauthenticate' +err)
        return res.status(401).json({
          success:'false',
          message :'token expired',
          err : err
        })
      } else {
        req.auth = result;
        console.log('Authenticate');
        next();
      }
    });
    
  } else{
    return res.status(403).json({
      success : 'false',
      message :'Forbidden'
    });
  }
}