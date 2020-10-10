'use strict';

const { Storage } = require('@google-cloud/storage');
const path    =  require('path');
const config = path.join(__dirname,'../config/google_storage.json');
const CLOUD_BUCKET = "edutore-cdn";


const storage =  new Storage({
  keyFilename : config,
  projectId: "edutore01",
});

const bucket = storage.bucket(CLOUD_BUCKET);
function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

function getPublicName(filename){
  return filename;
}

 const sendUploadToGCS = async (req, res, next) => {
  const jawabans = JSON.parse(req.body.jawabans);
  let imageJawab = [];
  let pathImage = req.header.path;
  let soalText = req.body.soal_text;
  
  if(!req.files.image){
    console.log('soal image not found');
    const maxImage = jawabans.length;
    for(let i = 1; i <= maxImage; i++){
      if (i < maxImage ){
        if(req.files[`jawaban_image${i}`]){
          const tes = req.files[`jawaban_image${i}`]
          console.log(tes);
          const jgcsname = await uploadJawabanImage(tes, pathImage, jawabans[i-1].jawaban_text);
          imageJawab.push(jgcsname)
          console.log(`jawaban image ${i}`);
        } else {
          imageJawab.push(undefined)
          console.log(`jawaban image ${i} not found`);
        }
      } else {
        if(req.files[`jawaban_image${i}`]){
          const tes = req.files[`jawaban_image${i}`]
          console.log(`jawaban image ${i}`);
          const jgcsname = await uploadJawabanImage(tes, pathImage, jawabans[i-1].jawaban_text);
          imageJawab.push(jgcsname)
          req.jawaban_images = imageJawab
          return next()
        } else {
          imageJawab.push(undefined)
          console.log(`jawaban image ${i} not found`);
          req.jawaban_images = imageJawab
          return next()
        }
      }
    }
  } else {
    console.log('soal image found');
    const soalImage = req.files.image[0];
    req.soalimage_name = await uploadSoalImage(soalImage, pathImage, soalText);
    const maxImage = jawabans.length;
    for(let i = 1; i <= maxImage; i++){
      if (i < maxImage ){
        if(req.files[`jawaban_image${i}`]){
          const tes = req.files[`jawaban_image${i}`]
          console.log(tes);
          const jgcsname = await uploadJawabanImage(tes, pathImage, jawabans[i-1].jawaban_text);
          imageJawab.push(jgcsname)
          console.log(`jawaban image ${i}`);
        } else {
          imageJawab.push(undefined)
          console.log(`jawaban image ${i} not found`);
        }
      } else {
        if(req.files[`jawaban_image${i}`]){
          const tes = req.files[`jawaban_image${i}`]
          console.log(`jawaban image ${i}`);
          const jgcsname = await uploadJawabanImage(tes, pathImage, jawabans[i-1].jawaban_text);
          imageJawab.push(jgcsname)
          req.jawaban_images = imageJawab
          return next()
        } else {
          imageJawab.push(undefined)
          console.log(`jawaban image ${i} not found`);
          req.jawaban_images = imageJawab
          return next()
        }
      }
    }
  }
}

const Multer = require('multer');
const multer = Multer(
{
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

const uploadSoalImage = async (imageSoal, pathImage, soalText) => {
  let sgcsname = '';
  if (!pathImage) {
    pathImage ='public/soal/question/';
    if(soalText != null && soalText != undefined){
      console.log('path find');
      var Soal = soalText.replace(/[^A-Z0-9]+/ig,'-');
      sgcsname += Soal
      let image = imageSoal.originalname;
      console.log(image);
      
      if(image != null && image != undefined){      
        var finalNameImage = image.replace(/[^A-Z0-9]+/ig,'-');
        sgcsname += '-' + finalNameImage
      }
    } else {
      let image = imageSoal.originalname;
      if(image != null && image != undefined){
        var finalNameImage = image.replace(/[^A-Z0-9]+/ig,'-');
        sgcsname += '-' + finalNameImage
      }
    }
  }
  const file = bucket.file(pathImage+sgcsname);
  console.log(pathImage+sgcsname);
  
  const stream = file.createWriteStream({
    metadata: {
      contentType: imageSoal.mimetype
    },
    resumable: false,
    gzip : true
  });

  stream.on('error', (err) => {
    console.log(err)
    imageSoal.cloudStorageError = err;
    next(err);
  });
    stream.on('finish', async () => {
      imageSoal.cloudStorageObject = sgcsname;
      console.log('file uploaded');
      await file.makePublic().then(async () => {
        console.log('finish');
        imageSoal.fileimage_name = await getPublicName(sgcsname);
        console.log(imageSoal.fileimage_name);
      });
    });
    stream.end(imageSoal.buffer);
    return sgcsname;
}

const uploadJawabanImage = async (image, pathImage, jawabanText) => {
  const jawabanImage = image[0]
  let jgcsname = '';
  if (!pathImage) {
    pathImage ='public/soal/question/';
    if(jawabanText != null && jawabanText != undefined){
      console.log('path find');
      var Soal = jawabanText.replace(/[^A-Z0-9]+/ig,'-');
      jgcsname += Soal
      let image = jawabanImage.originalname;
      console.log(image);
      
      if(image != null && image != undefined){      
        var finalNameImage = image.replace(/[^A-Z0-9]+/ig,'-');
        jgcsname += '-' + finalNameImage
      }
    } else {
      let image = jawabanImage.originalname;
      if(image != null && image != undefined){
        var finalNameImage = image.replace(/[^A-Z0-9]+/ig,'-');
        jgcsname += '-' + finalNameImage
      }
    }
  }
  const file = bucket.file(pathImage+jgcsname);
  console.log(pathImage+jgcsname);
  
  const stream = file.createWriteStream({
    metadata: {
      contentType: jawabanImage.mimetype
    },
    resumable: false,
    gzip : true
  });

  stream.on('error', (err) => {
    console.log(err)
    jawabanImage.cloudStorageError = err;
    next(err);
  });
    stream.on('finish', async () => {
      jawabanImage.cloudStorageObject = jgcsname;
      console.log('file uploaded');
      await file.makePublic().then(async () => {
        console.log('finish');
        jawabanImage.fileimage_name = await getPublicName(jgcsname);
        console.log(jawabanImage.fileimage_name);
      });
    });
    stream.end(jawabanImage.buffer);
    return jgcsname
}


module.exports = {
  getPublicName,
  sendUploadToGCS,
  multer
};
