'use strict';

const { Storage } = require('@google-cloud/storage');
const path    =  require('path');
const config = path.join(__dirname,'../config/google_storage.json');
const CLOUD_BUCKET = "edutore-cdn";

/**
 *  pathImages :'https://storage.googleapis.com/edutore-cdn/public/items/thumb/',
    pathImagesQ :'https://storage.googleapis.com/edutore-cdn/public/soal/question/',
    pathImagesAnswer :'https://storage.googleapis.com/edutore-cdn/public/soal/answer_choice/',
    pathPembahasan :'https://storage.googleapis.com/edutore-cdn/public/soal/discussion/',
*/
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

function sendUploadToGCS (req, res, next) {
  if (!req.file) {
    return next();
  } else {
    let pathImage = req.header.path;
    if (!pathImage) {
      pathImage ='tryout/'; ///public/soal/question/
    }
    let finalName = req.body.judul_quiz ? req.body.judul_quiz : 'quiz';
    let Judul = finalName.replace(/\s/g,'-');
    let image = req.file.originalname;
    let finalNameImage = image.replace(/\s/g,'-');
    const gcsname = Judul +'-'+ finalNameImage;
    const file = bucket.file(pathImage+gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      },
      resumable: false,
      gzip : true
    });

    stream.on('error', (err) => {
      console.log(err)
      req.file.cloudStorageError = err;
      next(err);
    });

    stream.on('finish', () => {
      req.file.cloudStorageObject = gcsname;
      req.fileimage_name = gcsname;
      file.makePublic().then(() => {
        req.file.fileimage_name = getPublicName(gcsname);
        next();
      });
    });

    stream.end(req.file.buffer);

  }
}

const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

module.exports = {
  getPublicName,
  sendUploadToGCS,
  multer
};