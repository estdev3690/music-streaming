import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let bucket;

export const initGridFS = () => {
    bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
};

export const uploadToGridFS = (file, filename) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            reject(new Error('Invalid file object'));
            return;
        }

        const uploadStream = bucket.openUploadStream(filename, {
            contentType: file.mimetype
        });

        const readableFile = Buffer.from(file.buffer);
        
        uploadStream.on('finish', () => {
            resolve(uploadStream.id);
        });
        
        uploadStream.on('error', (error) => {
            reject(error);
        });

        uploadStream.write(readableFile);
        uploadStream.end();
    });
};

export const getFileStream = async (fileId) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        throw new Error('Invalid file ID');
    }

    const id = new mongoose.Types.ObjectId(fileId);
    const files = await bucket.find({ _id: id }).toArray();
    
    if (!files.length) {
        throw new Error('File not found');
    }

    return bucket.openDownloadStream(id);
};

export const deleteFile = async (fileId) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        throw new Error('Invalid file ID');
    }

    const id = new mongoose.Types.ObjectId(fileId);
    
    // Check if file exists before attempting to delete
    const files = await bucket.find({ _id: id }).toArray();
    if (!files.length) {
        throw new Error('File not found');
    }

    try {
        await bucket.delete(id);
    } catch (error) {
        console.error('Error deleting file from GridFS:', error);
        throw new Error('Failed to delete file');
    }
}; 