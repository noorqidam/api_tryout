'use strict'
/**
 * Validate User Edutore
 */
module.exports = async function Valid(req, res , next){
  console.log('Edutore Middleware => ' +JSON.stringify(req.auth))
  let Auth = req.auth.authorized
  if (Auth ==='EDUTORE') {
    next();
  } else {
    return res.status(403).json({
      success : 'false',
      message :'Forbidden Access'
    });
  }
}