import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongoDB.js'
import adminRouter from './routes/adminRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
connectDB()
const app = express()
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set uploads directory based on environment
const uploadsDir = process.env.NODE_ENV === 'production' 
    ? '/opt/render/project/src/uploads'
    : path.join(__dirname, 'uploads')

app.use(express.json())
app.use(cors())

// Serve static files from the uploads directory
app.use('/upload', express.static(uploadsDir))

// Export uploads directory path for multer configuration
export const UPLOADS_DIR = uploadsDir

// API routes
app.use('/api/admin', adminRouter)

// Keep-alive endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

// Serve static files from the frontend build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    
    // Handle client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})