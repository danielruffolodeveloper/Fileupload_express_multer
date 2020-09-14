# File Upload using Express.js and Multer
An example of how to implementfile upload using Express.js and Multer

In this tutorial, We will look at how to implement file upload with Express.js. Fileupload is a important skill to learn as a web developer as it is a common feature in many applications built today. 

## Getting Started.
We first need to create a Node.js application. To do this, make a project folder and using terminal.
run the command <strong>npm init</strong> and follow the prompts. Make sure you point your file to server.js.

We then need to install some dependencies using the npm package manager.These are:
- Express
- Morgan
- Multer
       
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
For our application, we will use the express template found on their website and modify it to have 2 endpoints which are `/upload/singlefile` and `/upload/multifile` which is for uploading a single file or uploading an array of files.

### Multer Package
If you look closely at the endpoint, You will notice a method defined within the endpoint called `upload.single` and `upload.multiple`.  this is what calls the multer package every time we request a endpoint and you will see that we told multer to send files to a destination of 'uploads/' in the multer declaration. Multer is then responsible for moving the file from the request body into our defined uploads directory.

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

app.post('/upload/singlefile', upload.single('file'), (req, res, next) => {
    console.log(req.file)
    res.status(200).send(`File Uploaded: ${req.file.originalname}` )
  })

app.post('/upload/multifile', upload.array('files', 5), (req, res, next) => {
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

  ## Usage (Uploading Files)
  In order to post files to our endpoints, we will need to either make a post request with Multipart as our body or alternatively, use a tool such as Postman or Insomnia to build the post request without the need to set up a html form and so on.
  Using Insomnia, make a `POST` request and set the body type to Multipart. Then add a property called file and set the value type as file. Now select a file to upload and make the post request.
  
  #### Result
  ![Alt text](img/1.png?raw=true)
  #### Note
  The same process is followed for multiple files, only difference being that you add multiple file propertys to the body of your request

  ## File storage.
  After testing out the endpoints, your uploads directory will be populated with files however,these files are not readable. They are still valid files, we just didnt tell multer how we wanted the files to be stored.
  A few small modifications to our current code base can fix this. Multer has a function called `diskStorage` which enables us to define the destination and file name as functions so that you can implement custom logic on how we want that to be handeled.
  
  ```
    var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  var upload = multer({ storage: storage })
  ```

  This will send files to `/uploads` and each time , rename the file with a random name. Notice we are not saving the file extenson on the name such as `.png`,that is because we dont want the file to be accessable on the server. In a application situation, you might store the files metadata in a database and build the file on request once authorised to view with the original name and file extenson.

  #### Result
  ![Alt text](img/2.png?raw=true)

  ## From Here?
  From here, the application can be refined to:
   - Connect to a cloud storage provider
   - Serve as a file upload microservice to a bigger applicaion or API
   - Build your very own dropbox




