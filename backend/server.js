import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongoDB.js'
import adminRouter from './routes/adminRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { initGridFS, getFileStream } from './utils/gridfs.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Connect to MongoDB and initialize GridFS
await connectDB()
initGridFS()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// Serve files from GridFS
app.get('/upload/:fileId', async (req, res) => {
    try {
        const fileStream = await getFileStream(req.params.fileId);
        res.set('Content-Type', 'application/octet-stream');
        fileStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            res.status(404).json({ error: 'File not found' });
        });
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error accessing file:', error);
        res.status(400).json({ error: error.message });
    }
});

// API routes
app.use('/api/admin', adminRouter)

// Keep-alive endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

// Serve static files from the frontend build
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})