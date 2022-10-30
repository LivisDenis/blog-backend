import express from 'express'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from './validations.js'
import checkAuth from "./middleware/checkAuth.js";
import UserController from "./controllers/UserController.js";
import PostController from "./controllers/PostController.js";
import multer from "multer";
import cors from "cors";
import handleValidationErrors from "./utils/handleValidationErrors.js";
dotenv.config()

const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})
const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/registration', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.filename}`
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.post('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

const start = async () => {
    try {
        const PORT = process.env.PORT || 5001
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.hehrisc.mongodb.net/?retryWrites=true&w=majority')
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

