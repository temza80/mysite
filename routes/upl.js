/**
 * Created by yih on 20.1.17.
 */
const fs = require('fs');

function isFile (path,file) {
  return new Promise(function (resolve, reject) {
    fs.access(path, function (err, data) {
    	var retFile=file;
      if (!err)  retFile.name=Date.now()+retFile.name; // rejects the promise with `err` as the reason
     

      resolve(retFile)               // fulfills the promise with `data` as the value
    })
  })
}
function move (file) {
  return new Promise(function (resolve, reject) {
    file.mv('./public/images/'+file.name, function(err) {
       if (err) return reject(err) // rejects the promise with `err` as the reason
      resolve('./public/images/'+file.name);              // fulfills the promise with `data` as the value
    })
  })
}
module.exports.post=function(req,res,next) {

var image;

if (!req.files) {
console.log('no files!');
    return next(new Error('No files were uploaded.'));

}

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

image = req.files.image;
(image.mimetype);
   if(!(image.mimetype=='image/gif' ||
        image.mimetype=='image/png' ||
        image.mimetype=='image/jpeg')) { res.status(500).send(err);}

path='./public/images/'+image.name;

    var Jimp = require("jimp");

var fileName = './public/images/'+image.name;
var imageCaption = 'AnnaMaka';
var loadedImage;
isFile(path,image)
	  .then(function(file){ return move(file)})
	  .then(function(filename){fileName=filename; return Jimp.read(filename)})
      .then(function (image) {
      	image.resize(Jimp.AUTO,450);
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
       })
      .then(function (font) {
      	console.log('filename:'+fileName);
        loadedImage.print(font, 10, 425, imageCaption)
                   .write(fileName);
                  

    }).then(function(){res.status(200).send('<img src="/images/'+image.name+'" class="uploaded-images">');})
    .catch(function (err) {
        console.error(err);
    });

        
    
};
/*'+require('../public/lib/config').get('root')+
 ':'+require('../public/lib/config').get('port')+
 '*/
