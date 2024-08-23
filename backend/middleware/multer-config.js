const multer = require('multer');
const storage = multer.memoryStorage({
    destination: (req,file,callback) =>{
        callback(null, 'images')
    }
})