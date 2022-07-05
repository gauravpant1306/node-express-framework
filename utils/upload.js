const multer = require('multer');
// eslint-disable-next-line no-undef

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // eslint-disable-next-line no-undef
        cb(null, __basedir + '/uploads/excel')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload = multer({
    storage: storage,
});

module.exports = upload;