'use strict'
const ApiConfig = require('../../config/tokenKey');
const jwt       = require('jsonwebtoken');

/**
 * Validate Token Admin
 */
module.exports = async function Valid(req, res , next){
  if (req.headers['x-access-token']) {
    //Check Token
    jwt.verify(req.headers['x-access-token'],ApiConfig.Key ,function (err ,result){
      if (err) {
        return res.status(401).json({
          success:'false',
          message :'token expired',
          err : err
        })
      } else {
        req.auth = result;
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