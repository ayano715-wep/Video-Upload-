const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only video files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size
    }
});

// Serve static files
app.use(express.static('public'));

// Upload endpoint
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            message: 'No file uploaded' 
        });
    }
    
    res.json({
        success: true,
        message: 'Video uploaded successfully',
        file: {
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            path: req.file.path
        }
    });
});

// Get list of uploaded videos
app.get('/videos', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error reading uploads directory' 
            });
        }
        
        // Filter to only include video files
        const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.mpeg', '.mpg', '.ogg'];
        const videos = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return videoExtensions.includes(ext);
            })
            .map(file => ({
                filename: file,
                url: `/uploads/${file}`
            }));
        
        res.json({
            success: true,
            videos: videos
        });
    });
});

// Serve uploaded videos
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: 'File size is too large. Max size is 100MB.' 
            });
        }
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    } else if (err) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
