import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import dotenv from 'dotenv'

const app = express()
dotenv.config()
app.use(cors())
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use('/posts', postRoutes)
app.use('/user', userRoutes)
// // app.use(cors())
// const CONNECTION_URL =
//   'mongodb+srv://aditya:Dravid@cluster0.rdbqg.mongodb.net/cricgeek?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log('SERVER RUNNING')))
  .catch((err) => console.log(err.message))

// mongoose.set('useFindAndModify', false)
