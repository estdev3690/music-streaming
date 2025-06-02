import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongoDB.js'
import adminRouter from './routes/adminRoutes.js'
import path from 'path'

dotenv.config()
connectDB()
const app =express()
const PORT=process.env.PORT || 3000


app.use(express.json())
app.use(cors())

app.use('/upload',express.static(path.join(path.resolve(),'uploads')))
app.use('/api/admin',adminRouter)

app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})