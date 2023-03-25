import express from 'express'
import dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import multer from 'multer'
import uploadObject from './controllers/upload-object'
import deleteObject from './controllers/delete-object'
import listAllObjects from './controllers/list-objects'
import cors from 'cors'


dotenv.config()
const app = express()
const port = process.env.PORT
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), uploadObject)
app.delete('/delete', deleteObject)
app.get('/list', listAllObjects)

app.listen(port, () => {
  console.log(`Listening on port ${port}: http://localhost:${port}`)
})