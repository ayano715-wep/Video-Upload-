const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const fileNameSpan = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const messageDiv = document.getElementById('message');
const videosListDiv = document.getElementById('videosList');

// Handle file selection
videoFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        fileNameSpan.textContent = file.name;
        uploadBtn.disabled = false;
        
        // Validate file size (100MB)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            showMessage('File size exceeds 100MB limit', 'error');
            uploadBtn.disabled = true;
        }
    } else {
        fileNameSpan.textContent = 'Choose a video file or drag it here';
        uploadBtn.disabled = true;
    }
});

// Handle drag and drop
const fileLabel = document.querySelector('.file-label');

fileLabel.addEventListener('dragover', function(e) {
    e.preventDefault();
    fileLabel.style.borderColor = '#764ba2';
    fileLabel.style.backgroundColor = '#e8eaff';
});

fileLabel.addEventListener('dragleave', function(e) {
    e.preventDefault();
    fileLabel.style.borderColor = '#667eea';
    fileLabel.style.backgroundColor = '#f8f9ff';
});

fileLabel.addEventListener('drop', function(e) {
    e.preventDefault();
    fileLabel.style.borderColor = '#667eea';
    fileLabel.style.backgroundColor = '#f8f9ff';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        videoFileInput.files = files;
        const event = new Event('change');
        videoFileInput.dispatchEvent(event);
    }
});

// Handle form submission
uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const file = videoFileInput.files[0];
    if (!file) {
        showMessage('Please select a file', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('video', file);
    
    // Show progress
    progressContainer.style.display = 'block';
    uploadBtn.disabled = true;
    messageDiv.style.display = 'none';
    
    try {
        const xhr = new XMLHttpRequest();
        
        // Upload progress
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = `Uploading... ${Math.round(percentComplete)}%`;
            }
        });
        
        // Upload complete
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                showMessage(response.message, 'success');
                uploadForm.reset();
                fileNameSpan.textContent = 'Choose a video file or drag it here';
                uploadBtn.disabled = true;
                loadVideos(); // Refresh video list
            } else {
                const response = JSON.parse(xhr.responseText);
                showMessage(response.message || 'Upload failed', 'error');
            }
            progressContainer.style.display = 'none';
            progressBar.style.width = '0%';
        });
        
        // Upload error
        xhr.addEventListener('error', function() {
            showMessage('Upload failed. Please try again.', 'error');
            progressContainer.style.display = 'none';
            progressBar.style.width = '0%';
            uploadBtn.disabled = false;
        });
        
        xhr.open('POST', '/upload');
        xhr.send(formData);
        
    } catch (error) {
        showMessage('Upload failed: ' + error.message, 'error');
        progressContainer.style.display = 'none';
        uploadBtn.disabled = false;
    }
});

// Show message
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Get video MIME type from file extension
function getVideoMimeType(filename) {
    const parts = filename.split('.');
    if (parts.length < 2) {
        return 'video/mp4'; // Default fallback
    }
    const ext = parts.pop().toLowerCase();
    const mimeTypes = {
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'ogg': 'video/ogg',
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo',
        'mkv': 'video/x-matroska',
        'mpeg': 'video/mpeg',
        'mpg': 'video/mpeg'
    };
    return mimeTypes[ext] || 'video/mp4';
}

// Load and display uploaded videos
async function loadVideos() {
    try {
        const response = await fetch('/videos');
        const data = await response.json();
        
        if (data.success && data.videos.length > 0) {
            videosListDiv.innerHTML = '';
            data.videos.forEach(video => {
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                const mimeType = getVideoMimeType(video.filename);
                videoItem.innerHTML = `
                    <video controls>
                        <source src="${video.url}" type="${mimeType}">
                        Your browser does not support the video tag.
                    </video>
                    <div class="video-item-info">
                        <p>${video.filename}</p>
                    </div>
                `;
                videosListDiv.appendChild(videoItem);
            });
        } else {
            videosListDiv.innerHTML = '<p class="no-videos">No videos uploaded yet</p>';
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Load videos on page load
loadVideos();
