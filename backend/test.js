import connectDB from './config/mongoDB.js';
import { initGridFS, uploadToGridFS, getFileStream, deleteFile } from './utils/gridfs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testGridFS() {
    try {
        // Connect to MongoDB and initialize GridFS
        await connectDB();
        console.log('MongoDB connected successfully');
        initGridFS();
        console.log('GridFS initialized');

        // Create a test file
        const testFilePath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(testFilePath, 'Test content');

        // Test file upload
        const testFile = {
            buffer: fs.readFileSync(testFilePath),
            mimetype: 'text/plain',
            originalname: 'test.txt'
        };

        console.log('Uploading test file...');
        const fileId = await uploadToGridFS(testFile, 'test.txt');
        console.log('File uploaded successfully, ID:', fileId);

        // Test file retrieval
        console.log('Testing file retrieval...');
        const stream = await getFileStream(fileId);
        console.log('File stream retrieved successfully');

        // Test file deletion
        console.log('Testing file deletion...');
        await deleteFile(fileId);
        console.log('File deleted successfully');

        // Clean up test file
        fs.unlinkSync(testFilePath);
        console.log('Test completed successfully');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
}

testGridFS(); 