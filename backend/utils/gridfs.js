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
        const uploadStream = bucket.openUploadStream(filename, {
            contentType: file.mimetype
        });

        const readableFile = Buffer.from(file.buffer);
        
        const uploadPromise = new Promise((resolveUpload, rejectUpload) => {
            uploadStream.on('finish', () => {
                resolveUpload(uploadStream.id);
            });
            
            uploadStream.on('error', (error) => {
                rejectUpload(error);
            });
        });

        uploadStream.write(readableFile);
        uploadStream.end();

        return uploadPromise
            .then(fileId => resolve(fileId))
            .catch(error => reject(error));
    });
};

export const getFileStream = (fileId) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        throw new Error('Invalid file ID');
    }
    return bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
};

export const deleteFile = (fileId) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        throw new Error('Invalid file ID');
    }
    return bucket.delete(new mongoose.Types.ObjectId(fileId));
}; 