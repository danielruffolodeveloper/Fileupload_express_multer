# fileupload_express_multer
An example of how to implement file upload using express.js endpoints and multer

In this tutorial, We will look at how to build a file upload endpoint with Express.js. Fileupload is a important skill to learn as a web developer as it is a common feature in many applications built today. This endpoint can serve as a foundation to integrating with cloud providers such as GCP and AWS file upload services as this tutorial is very similar.

## Getting Started.
We first need to create a Node.js application. To do this, make a project folder and using terminal.
run the command <strong>npm init </strong> and follow the prompts. Make sure you point your file to server.js

We then need to install some dependencies using the npm package manager.These are:
- First item
- Second item
- Third item
- Fourth item
       
Our <strong>package.json</strong> file should now look something like this:
```
{
  "name": "tut_fileupload",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Daniel Ruffolo",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.2"
  }
}
```

You can go ahead and modify the package.json to suit your needs. For example, you might like to add a test script or a start script that runs nodemon,just run npm install to make the changes permanent and install any dependencies added.

## Setting up Express Server

This part is extremely easy and thats because express.js website is very informative and they provide easy examples to get started.
For our application, we basically take the express template (here) and modify it to have 2 endpoints which are /upload/singlefile and /upload/multifile which respectfully is for uploading a single file or uploading an array of files.

### Multer Package
If you look closely at the endpoint, you will notice a methhod defined within the endpoint called `upload.single` and `upload.multiple`.  this is what calls the multer packages functions every time we request a endpoint and you will see that we told multer to send files to a destination of 'uploads/'. Multer is then responsible for sanatising the file and moving the file from the request body into our directory.

#### Code (Server.js)
```
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

app.post('/upload/singlefile', upload.single('file'), function (req, res, next) {
    console.log(req.file)
    res.status(200).send(`File Uploaded: ${req.file.originalname}` )
  })

app.post('/upload/multifile', upload.array('files', 5), function (req, res, next) {
    res.status(200).send(`Files Uploaded: ${req.files.length}` )
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```
#### Error Handeling
Lets now add some error handeling. When we upload a file, a mehod is expected to run that looks at our reqest body for a file. If its not provided,
the application will crash. It is therefore nessisary to implement a validation that checks for the file otherwise returns an error of 'file not found'.
<strong>Change the endpoints in server.js acordingly.</strong>

```
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
  ```



