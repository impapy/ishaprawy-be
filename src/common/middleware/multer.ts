import Multer from 'multer'

export default class MulterFileHandler {
  static getInstance = () => {
    const multer = Multer({
      storage: Multer.diskStorage({
        destination: function (req, file, callback) {
          callback(null, `${__dirname}/audio-files`)
        },
        filename: function (req, file, callback) {
          callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    })
    return multer
  }
}
