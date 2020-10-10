'use strict'
const ApiConfig = require('../../config/tokenKey');
const jwt       = require('jsonwebtoken');

/**
 * Validate Token Author
 */
module.exports = async function Valid(req, res , next){
  if (req.headers['token_pin']) {
    //Check Token
    jwt.verify(req.headers['token_pin'],ApiConfig.Key ,function (err ,result){
      if (err) {
        return res.status(401).json({
          success:'false',
          message :'token expired',
          err : err
        })
      } else {
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