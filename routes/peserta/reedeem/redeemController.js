'use strict'
const	express  	=	require('express');
const	Sequelize	=	require('sequelize');
const { param, check, validationResult } = require('express-validator')
const	Op 			= 	Sequelize.Op;
const	router 		= 	express.Router();
const db      = require('../../../models/index');
const mongoose = require('mongoose');
const { Ujian } = require('../../../models/mongoose/Ujian');
const { Quiz } = require('../../../models/mongoose/Quiz')
const { PesertaUjian } = require('../../../models/mongoose/PesertaUjian');
const { PesertaQuiz } = require('../../../models/mongoose/PesertaQuiz');


/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  
});

/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/:voucher_code', [
  param('voucher_code').exists().withMessage('required'),
  check('category').exists().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(422).json({
      success: 'false',
      error: err
    })
  } else {   
    try {
      const voucher_code = req.params.voucher_code;
      const category = req.query.category
      const cek_voucher = await db.voucher_detail.findOne({
        where: {
          voucher_code: {
            [Op.eq]: voucher_code
          }
        }
      })
      
      if (cek_voucher) {
        if (cek_voucher.category === 'ALL' || cek_voucher.category === category) {          
          const used = cek_voucher.used
          if (used === false) {
            const cek_expired = +cek_voucher.start_at <= +Date.now() < +cek_voucher.expire_at;
            if (cek_expired) {
              return res.status(200).json({
                success: 'true',
                message: 'Voucher found',
                data: cek_voucher
              })      
            } else {        
              return res.status(200).json({
                success: 'true',
                message: 'Voucher is expired'
              })
            }            
          } else {
            return res.status(404).json({
              success: 'false',
              message: 'Voucher already used'
            })
          }
        } else {
          return res.status(404).json({
            success: 'false',
            message: `Voucher ${cek_voucher.category} tidak bisa digunakan untuk ${category}`
          })
        }
      } else {
        return res.status(404).json({
          success: 'false',
          message: 'Voucher Not Found'
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 'true',
        error: error
      })
    }
  }
});

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/ujian', [
  check('voucher_code').exists().withMessage('required'),
  check('ujian_id').exists().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    console.log(err);
    return res.status(422).json({
      success: 'false',
      message: err
    })
  } else {
    const { voucher_code, ujian_id } = req.body;
    const { user_id, email } = req.auth;
    try {
      const ujian = await Ujian.findOne({
        _id: ujian_id
      })
      if(ujian){
        const price = parseFloat(ujian.price);
        const cek_voucher = await db.voucher_detail.findOne({
          where: {
            voucher_code: {
              [Op.eq]: voucher_code
            },
            used: {
              [Op.eq]: false
            }
          }
        })
        if (cek_voucher) {
          const cek_expired = +cek_voucher.start_at <= +Date.now() < +cek_voucher.expire_at
          if (cek_expired) {
            const category = cek_voucher.category;
            if(category === 'ALL' || category === 'UJIAN') {
              const min_transaction = cek_voucher.min_transaction < price;
              if (min_transaction) {
                const max_value = cek_voucher.max_value >= price;
                if (max_value) {
                  
                  const voucher_value = cek_voucher.voucher_value === 100;
                  if (voucher_value) {
                    // var id = mongoose.Types.ObjectId();
                    const Peserta = new PesertaUjian({
                      ujian_id : ujian_id,
                      user_id: user_id,
                      email: email,
                      start_time: ujian.start_time
                    });
                    const data = {
                      voucher_id: cek_voucher.id,
                      voucher_code: cek_voucher.voucher_code,
                      created_at: Date.now(),
                      email: email,
                      user_id: user_id,
                      category: 'UJIAN',
                      judul: ujian.judul_ujian,
                      deskripsi: `Pemakaian voucher ${voucher_code}, ${email}, ${ujian.judul_ujian}`
                    }
                    const redeem = await db.redeem_voucher.create(data);
                    let info = await Peserta.save();
                    const voucher_detail = await db.voucher_detail.update({used: true}, {
                      where : {
                        id: {
                          [Op.eq] : cek_voucher.id
                        }
                      }
                    })
                    return res.status(200).json({
                      success: 'true',
                      message: 'Redeem success, voucher valid, ujian has been added to your account',
                      data: {
                        ujian_id: ujian_id,
                        voucher: voucher_code,
                        price: price
                      },
                      info: info,
                      redeem: redeem,
                      voucher_detail: voucher_detail
                    })
                  } else {
                    console.log('Redeem failed, voucher value tidak cukup untuk proses redeem');                    
                    return res.status(404).json({
                      success: 'false',
                      message: 'Redeem failed, voucher value tidak cukup untuk proses redeem'
                    })
                  }
                } else {
                  console.log('Redeem failed, max discount value voucher tidak cukup untuk proses redeem');
                  return res.status(404).json({
                    success: 'false',
                    message: 'Redeem failed, max discount value voucher tidak cukup untuk proses redeem',
                    data: {
                      ujian_id: ujian_id,
                      voucher: voucher_code,
                      max_discount: cek_voucher.max_value,
                      price: price
                    }
                  })
                }
              } else {
                console.log('Redeem failed, minimum transaksi tidak terpenuhi');
                return res.status(404).json({
                  success: 'false',
                  message: 'Redeem failed, minimmum transaksi tidak terpenuhi',
                  data: {
                    ujian_id: ujian_id,
                    voucher: voucher_code,
                    min_transaction: cek_voucher.min_transaction,
                    price: price
                  }
                })
              }
            } else {
              console.log('Redeem failed, voucher category tidak sesuai');
              return res.status(404).json({
                success: 'false',
                message: 'Redeem failed, voucher category tidak sesuai',
                data: {
                  ujian_id: ujian_id,
                  voucher: voucher_code,
                  price: price
                }
              })
            }
          } else {
            console.log('Redeem failed, voucher expired');
            return res.status(404).json({
              success: 'false',
              message: 'Redeem failed, voucher expired',
              data: {
                voucher_code: voucher_code,
                ujian_id: ujian_id,
                price: price
              }
            })
          }
        } else {
          console.log('Redeem failed, voucher not found');
          return res.status(404).json({
            success: 'false',
            message: 'Redeem failed, voucher is Already used or not found',
            data: {
              ujian_id: ujian_id,
              voucher_code: voucher_code,
              price: price
            }
          })
        }
      } else {
        console.log('ujian not found');
        return res.status(404).json({
          success: 'false',
          message: 'Ujian Not Found'
        })
      }
      
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 'false',
        error: error
      })
    }
  }
});

router.post('/quiz', [
  check('voucher_code').exists().withMessage('required'),
  check('quiz_id').exists().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    console.log(err);
    return res.status(422).json({
      success: 'false',
      message: err
    })
  } else {
    const { voucher_code, quiz_id, user_id, email } = req.body;
    try {
      const quiz = await Quiz.findOne({
        _id: quiz_id
      })
      if(quiz){
        const price = parseFloat(quiz.price);
        const cek_voucher = await db.voucher_detail.findOne({
          where: {
            voucher_code: {
              [Op.eq]: voucher_code
            },
            used: {
              [Op.eq]: false
            }
          }
        })
        if (cek_voucher) {
          const cek_expired = +cek_voucher.start_at <= +Date.now() < +cek_voucher.expire_at
          if (cek_expired) {
            const category = cek_voucher.category;
            if(category === 'ALL' || category === 'QUIZ') {
              const min_transaction = cek_voucher.min_transaction < price;
              if (min_transaction) {
                const max_value = cek_voucher.max_value >= price;
                if (max_value) {
                  
                  const voucher_value = cek_voucher.voucher_value === 100;
                  if (voucher_value) {
                    // var id = mongoose.Types.ObjectId();
                    const Peserta = new PesertaQuiz({
                      quiz_id : quiz_id,
                      user_id: user_id,
                      email: email,
                      start_time: quiz.start_time
                    });
                    const data = {
                      voucher_id: cek_voucher.id,
                      voucher_code: cek_voucher.voucher_code,
                      created_at: Date.now(),
                      email: email,
                      user_id: user_id,
                      category: 'QUIZ',
                      judul: quiz.judul_quiz,
                      deskripsi: `Pemakaian voucher ${voucher_code}, ${email}, ${quiz.judul_quiz}`
                    }
                    const redeem = await db.redeem_voucher.create(data);
                    let info = await Peserta.save();
                    const voucher_detail = await db.voucher_detail.update({used: true}, {
                      where : {
                        id: {
                          [Op.eq] : cek_voucher.id
                        }
                      }
                    })
                    return res.status(200).json({
                      success: 'true',
                      message: 'Redeem success, voucher valid, quiz has been added to your account',
                      data: {
                        quiz_id: quiz_id,
                        voucher: voucher_code,
                        price: price
                      },
                      info: info,
                      redeem: redeem,
                      voucher_detail: voucher_detail
                    })
                  } else {
                    console.log('Redeem failed, voucher value tidak cukup untuk proses redeem');                    
                    return res.status(404).json({
                      success: 'false',
                      message: 'Redeem failed, voucher value tidak cukup untuk proses redeem'
                    })
                  }
                } else {
                  console.log('Redeem failed, max discount value voucher tidak cukup untuk proses redeem');
                  return res.status(404).json({
                    success: 'false',
                    message: 'Redeem failed, max discount value voucher tidak cukup untuk proses redeem',
                    data: {
                      quiz_id: quiz_id,
                      voucher: voucher_code,
                      max_discount: cek_voucher.max_value,
                      price: price
                    }
                  })
                }
              } else {
                console.log('Redeem failed, minimum transaksi tidak terpenuhi');
                return res.status(404).json({
                  success: 'false',
                  message: 'Redeem failed, minimmum transaksi tidak terpenuhi',
                  data: {
                    quiz_id: quiz_id,
                    voucher: voucher_code,
                    min_transaction: cek_voucher.min_transaction,
                    price: price
                  }
                })
              }
            } else {
              console.log('Redeem failed, voucher category tidak sesuai');
              return res.status(404).json({
                success: 'false',
                message: 'Redeem failed, voucher category tidak sesuai',
                data: {
                  quiz_id: quiz_id,
                  voucher: voucher_code,
                  price: price
                }
              })
            }
          } else {
            console.log('Redeem failed, voucher expired');
            return res.status(404).json({
              success: 'false',
              message: 'Redeem failed, voucher expired',
              data: {
                voucher_code: voucher_code,
                quiz_id: quiz_id,
                price: price
              }
            })
          }
        } else {
          console.log('Redeem failed, voucher not found');
          return res.status(404).json({
            success: 'false',
            message: 'Redeem failed, voucher is Already used or not found',
            data: {
              quiz_id: quiz_id,
              voucher_code: voucher_code,
              price: price
            }
          })
        }
      } else {
        console.log('quiz not found');
        return res.status(404).json({
          success: 'false',
          message: 'Quiz Not Found'
        })
      }
      
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 'false',
        error: error
      })
    }
  }
});

router.post('/redeem', [
  check('status_pay').exists().withMessage('required'),
  check('user_id').exists().withMessage('required'),
  check('email').exists().withMessage('required'),
  check('ujian_id').exists().withMessage('required')
], async (req, res) => {
  const err = validationResult(req);
  if(!err.isEmpty()){
    console.log(err);
    return res.status(422).json({
      success: 'false',
      message: err
    })
  } else {
    const ujian_id = req.body.ujian_id;
    const user_id =  req.body.user_id;
    const email = req.body.email;
    const status_pay = req.body.status_pay;
    try {
      if (status_pay) {
      var id = mongoose.Types.ObjectId();
      const Peserta = new PesertaUjian({
        ujian_id : ujian_id,
        user_id: user_id,
        email: email
      });

      let info = await Peserta.save();
      return res.status(201).json({
        success : 'true',
        message :'Berhasil Menambah Peserta',
        data : info
      });
      } else {
        return res.status(401).json({
          success: 'false',
          message: 'Selesaikan Pembayaran'
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 'false',
        error: error
      })
    }
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