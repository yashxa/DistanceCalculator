const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const path = require('path');

const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(fileUpload());

// Mount the upload route
app.use('/upload', uploadRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created:', uploadsDir);
}