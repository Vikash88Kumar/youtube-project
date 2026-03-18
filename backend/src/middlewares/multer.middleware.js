import multer from "multer"

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/temp')
//   },
//   filename: function (req, file, cb) {
//     cb(null,file.originalname)
//   }
// })

// const upload = multer({ storage: storage })
// export {upload}


const storage = multer.diskStorage({
   destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type"), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})
