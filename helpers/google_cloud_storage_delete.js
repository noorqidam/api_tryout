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

let deletefile = async (banner_name, path_image) => {
  if(!banner_name){
    return
  } else {
    let pathImage = path_image;
    if(!pathImage){
      pathImage = 'tryout/'
    }
    let filename = banner_name
    await bucket.file(pathImage+filename).delete()
    .then(()=>{
      console.log(`gs://${CLOUD_BUCKET}/${pathImage+filename} deleted`);
      return
    })
    .catch(err => {
      console.log('error code: ' + err.code + '\n' + 'error messaage: ' + JSON.stringify(err.errors[0].message));
      return
    })
  }
}

module.exports = {deletefile};