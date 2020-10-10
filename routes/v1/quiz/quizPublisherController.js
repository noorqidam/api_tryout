'use strict'
const	express  	=	require('express');
const	router 		= 	express.Router();
const { check, validationResult } = require('express-validator');
const { Quiz  } = require('../../../models/mongoose/Quiz');
const { SoalQuiz } = require('../../../models/mongoose/SoalQuiz')
const mongoose = require('mongoose')
const UploadImage  = require('../../../helpers/google_cloud_quiz_storage')
const { QuizAccess } = require('../../../models/mongoose/QuizAccess')
const moment = require('moment')
moment().locale('id')
/**
* Display a listing of the resource
*
* @return array of Object
*/

router.get('/',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  let publisher = req.auth.accountkey;
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  let auth = req.auth;
  if (auth.role ==='ADMIN' || auth.role ==='STAF') {
    try {
   
      const CountQUiz = await Quiz.countDocuments({ penyelenggara:{$eq: publisher}, deleted: false })
      const DataQUiz = await Quiz.find({ penyelenggara:{$eq: publisher}, deleted: false })
        .limit(limit)
        .skip(offset)
        .sort({ id : -1});
        
      return res.status(201).json({
        success : 'true',
        message :'Success',
        data :DataQUiz,
        count: CountQUiz
      });
     
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  } else {
    try {
      const CountQUiz = await Quiz.countDocuments({ 
        penyelenggara:{$eq: publisher}, 
        createdBy: { $eq: auth.username },
        deleted: {$eq:false} 
      })
      const DataQUiz = await Quiz.find({ 
        penyelenggara:{$eq: publisher}, 
        createdBy: { $eq: auth.username }, 
        deleted: {$eq:false} 
      })
        .limit(limit)
        .skip(offset)
        .sort({ id : -1});
        
      return res.status(201).json({
        success : 'true',
        message :'Success',
        data :DataQUiz,
        count: CountQUiz
      });
     
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
  
});


router.get('/search',async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit) || 100;
  let offset = (page * limit) - limit;
  let sort = req.query.by || 'DESC';
  const judul = new RegExp(req.query.judul);
  let publisher = req.auth.accountkey;
  let ORDER = 'DESC';
  if (sort) {
    ORDER = sort.toUpperCase();  
  }
  let auth = req.auth;
  if (auth.role ==='ADMIN' || auth.role ==='STAF') {
    try {
   
      const CountQuiz = await Quiz.countDocuments({ 
        judul_quiz: { $regex: judul, $options: 'i'},
        penyelenggara:{$eq: publisher}, 
        deleted: false 
      })
      const DataQuiz = await Quiz.find({ 
        judul_quiz: { $regex: judul, $options: 'i'} ,
        penyelenggara:{$eq: publisher},
        deleted: false
      })
        .limit(limit)
        .skip(offset)
        .sort({ id : -1});
        
      return res.status(201).json({
        success : 'true',
        message :'Success',
        data :DataQuiz,
        count: CountQuiz
      });
     
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  } else {
    try {
      const CountQUiz = await Quiz.countDocuments({ 
        judul_quiz: { $regex: judul, $options: 'i'},
        penyelenggara:{$eq: publisher}, 
        createdBy: { $eq: auth.username },
        deleted: {$eq:false} 
      })
      const DataQUiz = await Quiz.find({ 
        judul_quiz: { $regex: judul, $options: 'i'},
        penyelenggara:{$eq: publisher}, 
        createdBy: { $eq: auth.username }, 
        deleted: {$eq:false} 
      })
        .limit(limit)
        .skip(offset)
        .sort({ id : -1});
        
      return res.status(201).json({
        success : 'true',
        message :'Success',
        data :DataQUiz,
        count: CountQUiz
      });
     
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
  
});

/**
* Display the specified resource
*
* @param	String/int 	 id
*
*/

router.get('/:id',async (req, res) => {
  let id = req.params.id
  let publisher = req.auth.accountkey;
  try {
    const GetQuiz = await Quiz.findOne({ penyelenggara : {$eq: publisher}, _id:{ $eq: id }, deleted: false })
    const GETSoalQuiz = await SoalQuiz.findOne({ quiz_id : id})
    const GetQuizAccess = await QuizAccess.findOne({ quiz_id : GetQuiz._id})

    if (GetQuiz) {
      return res.status(200).json({
        success : 'true',
        message :'Data Di Temukan',
        data :GetQuiz,
        soal: GETSoalQuiz,
        quiz_access: GetQuizAccess
      });
    } else {
      return res.status(404).json({
        success : 'false',
        message :'Data Tidak Di Temukan'
      });
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : 'false',
      message :error
    });
  }
});

/**
* Stored a newly created resource in storage.
*
* @request body of Object type
*/

router.post('/',
  UploadImage.multer.single('quiz_banner'),
  UploadImage.sendUploadToGCS,
[ 
  check('judul_quiz').not().isEmpty().withMessage('required'),
  check('quiz_slug').not().isEmpty().withMessage('required'),
  check('type_quiz').not().isEmpty().withMessage('required'),
  check('is_premium').not().isEmpty().withMessage('required'),
  check('is_private').not().isEmpty().withMessage('required'),
  check('publish').not().isEmpty().withMessage('require'),
  check('category_quiz').not().isEmpty().withMessage('required'),
  check('metode_penilaian').not().isEmpty().withMessage('require'),
  check('times').not().isEmpty().withMessage('require'),
  check('end_times').not().isEmpty().withMessage('require'),
  check('start_date').not().isEmpty().withMessage('require'),
  check('end_date').not().isEmpty().withMessage('require'),
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).json({ errors: errors.array() ,validate : false });
  } else {
    try {
      console.log(req.body)
      let auth = req.auth;
      let publisher = req.auth.accountkey;
      let start_date = req.body.start_date ? req.body.start_date : moment().add('days',1)
      let end_date = req.body.end_date ? req.body.end_date : moment().add('days',1)
      let publish = req.body.publish;
      let durasitampilPerSoal = req.body.durasi_soal ? req.body.durasi_soal : 120
      let is_premium = req.body.is_premium
      var id = mongoose.Types.ObjectId();
      
      const CreateQuiz = new Quiz({
        _id: id,
        judul_quiz: req.body.judul_quiz,
        quiz_slug: req.body.quiz_slug,
        quiz_banner: req.fileimage_name,
        type_quiz: req.body.type_quiz,
        is_premium: req.body.is_premium ? req.body.is_premium : false,
        is_private: req.body.is_private ? req.body.is_private : false,
        category_quiz: req.body.category_quiz,
        penyelenggara: publisher,
        start_date: moment(start_date).format('YYYY-MM-DD'),
        end_date: moment(end_date).format('YYYY-MM-DD'),
        type_start : req.body.type_start,
        times: req.body.times,
        end_times: req.body.end_times,
        durasi_soal : parseInt(durasitampilPerSoal),
        waktu_pengerjaan: req.body.waktu_pengerjaan,
        publish : publish,
        price : is_premium ? req.body.price : 0,
        metode_penilaian: req.body.metode_penilaian,
        description: req.body.description,
        createdBy: auth.username
      });

      if (req.body.is_private === true || req.body.is_private ==='true') {
        const CreateAccesQuiz = new QuizAccess({
          quiz_id : id,
          acces_pin: req.body.pin,
        })
        let pin = await CreateAccesQuiz.save()
        let info = await CreateQuiz.save();
        return res.status(201).json({
          success : 'true',
          message :'Success Save',
          data : info,
          pin: pin
        });
      } else {
        let info = await CreateQuiz.save();
        return res.status(201).json({
          success : 'true',
          message :'Success Save',
          data : info
        });
      }
      
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
});

/**
* Update the specified resource in storage.
*
* @param  int  id
* @return Response
*/

router.put('/:id',[
  check('id').not().isEmpty().withMessage('require'),
  check('judul_quiz').not().isEmpty().withMessage('required'),
  check('quiz_slug').not().isEmpty().withMessage('required'),
  check('type_quiz').not().isEmpty().withMessage('required'),
  check('is_premium').not().isEmpty().withMessage('required'),
  check('is_private').not().isEmpty().withMessage('required'),
  check('publish').not().isEmpty().withMessage('require'),
  check('category_quiz').not().isEmpty().withMessage('required'),
  check('metode_penilaian').not().isEmpty().withMessage('require'),
  check('times').not().isEmpty().withMessage('require'),
  check('end_times').not().isEmpty().withMessage('require'),
  check('start_date').not().isEmpty().withMessage('require'),
  check('end_date').not().isEmpty().withMessage('require'),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).json({ errors: errors.array() });
  } else {
    
    let id = req.params.id;
    let publisher = req.auth.accountkey;
    try {
      let start_date = req.body.start_date ? req.body.start_date : new Date().toString()
      let end_date = req.body.end_date ? req.body.end_date : new Date().toString()
      let durasitampilPerSoal = req.body.durasi_soal ? req.body.durasi_soal : 120
      let is_private = req.body.is_private
      let is_premium = req.body.is_premium
      //const GetQuiz = await Quiz.findById({ _id : id})
      const GetQuiz = await Quiz.findOne({
        penyelenggara: { $eq: publisher},
        _id: { $eq: id},
        deleted: false
      })

      const UpdateQuiz = {
        judul_quiz: req.body.judul_quiz,
        quiz_slug: req.body.quiz_slug,
        type_quiz: req.body.type_quiz,
        is_premium: req.body.is_premium ? req.body.is_premium : false,
        is_private: req.body.is_private ? req.body.is_private : false,
        category_quiz: req.body.category_quiz,
        penyelenggara:  req.body.penyelenggara,
        start_date: moment(start_date).format('YYYY-MM-DD'),
        end_date:moment(end_date).format('YYYY-MM-DD'),
        type_start : req.body.type_start,
        times: req.body.times,
        end_times: req.body.end_times,
        durasi_soal : parseInt(durasitampilPerSoal),
        waktu_pengerjaan: req.body.waktu_pengerjaan,
        metode_penilaian: req.body.metode_penilaian,
        publish : req.body.publish,
        price : is_premium ? req.body.price : 0,
        description: req.body.description
      } 
      if (GetQuiz) {
        if(is_private){
          const findAccessQuiz = await QuizAccess.findOne({ quiz_id : GetQuiz._id})
          if (findAccessQuiz) {
            let updatePin = await findAccessQuiz.updateOne({
              acces_pin: req.body.pin
            })

            let infoUpdate =  await GetQuiz.updateOne(UpdateQuiz);
            return res.status(201).json({
              success : 'true',
              message :'Success Update Quiz ' + id, 
              data :infoUpdate,
              pin: updatePin
            });
          } else {

            const CreateAccesQuiz = new QuizAccess({
              quiz_id : GetQuiz._id,
              acces_pin: req.body.pin,
            })

            let pin = await CreateAccesQuiz.save();

            let infoUpdate =  await GetQuiz.updateOne(UpdateQuiz);
            return res.status(201).json({
              success : 'true',
              message :'Success Update Quiz ' + id, 
              data :infoUpdate,
              pin: pin
            });
          }
        } else {
          let infoUpdate =  await GetQuiz.updateOne(UpdateQuiz);
          return res.status(201).json({
            success : 'true',
            message :'Success Update Quiz ' + id, 
            data :infoUpdate
          });
        }
        
      } else {
        return res.status(404).json({
          success : 'false',
          message :'Data Tidak Di Temukan'
        });
      }
      

    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success : 'false',
        message :error
      });
    }
  }
});

module.exports	=	router;