
const express = require('express')
const multer  = require('multer')
const morgan = require('morgan')
const upload = multer({ dest: 'uploads/' })
const app = express()
const port = 5000

app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.send('File Upload Tutorial')
})

app.post('/upload/singlefile', upload.single('file'),(req, res, next) => {

    if (!req.file) {
        const error = new Error('No File Uploaded')
        error.httpStatusCode = 400
        return next(error)
      }
   
    res.status(200).send(`File Uploaded: ${req.file.originalname}` )
  })

app.post('/upload/multifile', upload.array('file', 10),(req, res, next) => {

    if (req.files.length === 0) {
        const error = new Error('No Files Uploaded')
        error.httpStatusCode = 400
        return next(error)
      }
    res.status(200).send(`Files Uploaded: ${req.files.length}` )
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})