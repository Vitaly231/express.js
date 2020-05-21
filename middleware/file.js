const multer = require('multer')
const storage = multer.diskStorage( {
    destination(req, file, cb) {
// куда нужно складывать данный файл (null - error, images - папка)
        cb(null, 'images')
    },
    filename(req, file, cb) {
// в этой ф-ции описываетя как назвать новый файл
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
// валдиатор для файлов, ограничивает расширения для загружаемых файлов (true - валидация пройдена)
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


module.exports = multer({
    storage,
    fileFilter
})