# Video Upload Application

A simple and elegant web application for uploading and managing video files. Built with Node.js, Express, and vanilla JavaScript.

## Features

- 📤 Upload video files (MP4, AVI, MOV, MKV, WebM)
- 📊 Real-time upload progress indicator
- 🎬 Display uploaded videos with video player
- 🖱️ Drag and drop file support
- ✅ Client and server-side file validation
- 📏 File size limit: 100MB
- 💅 Modern, responsive UI design

## Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ayano715-wep/Video-Upload-.git
cd Video-Upload-
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Upload videos:
   - Click on the upload area to select a video file
   - Or drag and drop a video file into the upload area
   - Click "Upload Video" to start uploading
   - View your uploaded videos in the gallery below

## Project Structure

```
Video-Upload-/
├── server.js           # Express server with upload endpoints
├── package.json        # Project dependencies
├── public/             # Frontend files
│   ├── index.html     # Main HTML page
│   ├── styles.css     # Styling
│   └── script.js      # Client-side JavaScript
├── uploads/           # Directory for uploaded videos (created automatically)
└── README.md          # This file
```

## API Endpoints

### POST /upload
Upload a video file

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'video' field

**Response:**
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "file": {
    "filename": "video-1234567890-123456789.mp4",
    "originalname": "my-video.mp4",
    "size": 12345678,
    "path": "uploads/video-1234567890-123456789.mp4"
  }
}
```

### GET /videos
Get list of all uploaded videos

**Response:**
```json
{
  "success": true,
  "videos": [
    {
      "filename": "video-1234567890-123456789.mp4",
      "url": "/uploads/video-1234567890-123456789.mp4"
    }
  ]
}
```

## Configuration

You can modify the following settings in `server.js`:

- **Port**: Change `PORT` variable (default: 3000)
- **Max file size**: Modify `limits.fileSize` in multer configuration (default: 100MB)
- **Allowed file types**: Update `allowedMimes` array in fileFilter function

## Technologies Used

- **Backend**: Node.js, Express.js
- **File Upload**: Multer
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)

## License

MIT