import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongoDB.js'
import adminRouter from './routes/adminRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { initGridFS, getFileStream } from './utils/gridfs.js'
import fs from 'fs'
import { GridFSBucket } from 'mongodb'
import mongoose from 'mongoose'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Connect to MongoDB and initialize GridFS
await connectDB()
initGridFS()

const app = express()
const PORT = process.env.PORT || 3000

// Helper function to normalize origin URL
const normalizeOrigin = (origin) => {
    if (!origin) return origin;
    return origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

// Configure CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = process.env.FRONTEND_URL 
            ? [normalizeOrigin(process.env.FRONTEND_URL)]
            : ['https://music-streaming-gilt.vercel.app'];
            
        const normalizedOrigin = normalizeOrigin(origin);
        
        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json())

// Serve files from GridFS with proper content types
app.get('/upload/:fileId', async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.fileId);
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        // First, get the file metadata
        const files = await bucket.find({ _id: fileId }).toArray();
        if (!files.length) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = files[0];
        
        // Set the appropriate content type
        res.set('Content-Type', file.contentType);
        res.set('Accept-Ranges', 'bytes');

        // Handle range requests for audio streaming
        const range = req.headers.range;
        if (range && file.contentType.startsWith('audio/')) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
            const chunksize = (end - start) + 1;
            
            res.status(206);
            res.set({
                'Content-Range': `bytes ${start}-${end}/${file.length}`,
                'Content-Length': chunksize,
                'Content-Type': file.contentType
            });

            const downloadStream = bucket.openDownloadStream(fileId, {
                start,
                end: end + 1
            });
            downloadStream.pipe(res);
        } else {
            // For images or direct downloads
            const downloadStream = bucket.openDownloadStream(fileId);
            downloadStream.pipe(res);
        }

        // Handle errors
        res.on('error', error => {
            console.error('Error streaming file:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error streaming file' });
            }
        });
    } catch (error) {
        console.error('Error accessing file:', error);
        if (!res.headersSent) {
            res.status(400).json({ error: error.message });
        }
    }
});

// API routes
app.use('/api/admin', adminRouter)

// Keep-alive endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

// Serve static files from the frontend build only if the directory exists
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    
    if (fs.existsSync(frontendPath)) {
        console.log('Serving frontend from:', frontendPath);
        app.use(express.static(frontendPath));
        
        app.get('*', (req, res) => {
            res.sendFile(path.join(frontendPath, 'index.html'));
        });
    } else {
        console.log('Frontend build directory not found at:', frontendPath);
        // Handle API 404s
        app.use((req, res) => {
            if (req.path.startsWith('/api/')) {
                res.status(404).json({ error: 'API endpoint not found' });
            } else {
                res.status(404).json({ 
                    error: 'Frontend not deployed. Please ensure frontend is built and deployed correctly.',
                    path: req.path
                });
            }
        });
    }
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})