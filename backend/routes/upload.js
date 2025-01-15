const express = require('express');
const path = require('path');
const fs = require('fs');
const { processFile } = require('../services/pythonRunner');

const router = express.Router();

// Define upload directory
const uploadDir = process.env.PERSISTENT_STORAGE_PATH || '/tmp';

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Upload directory created: ${uploadDir}`);
}

router.post('/', async (req, res) => {
    console.log('File upload endpoint hit'); // Log the route access

    // Check if a file was uploaded
    if (!req.files || !req.files.file) {
        console.log('No file uploaded');
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const filePath = path.join(uploadDir, file.name);
    console.log(`File received: ${file.name}`);

    // Save the uploaded file and process it
    try {
        // Save file to the upload directory
        await file.mv(filePath);
        console.log(`File saved to: ${filePath}`);

        // Call the Python processing function with the file path
        const result = await processFile(filePath);
        console.log('Processing result:', result);

        // Send the result as a JSON response
        res.json({ distances: result });
    } catch (err) {
        console.error('Error processing file:', err.message);

        // Send an error response
        res.status(500).send(`Error processing file: ${err.message}`);
    } finally {
        // Clean up: Delete the file after processing to free up space
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`File deleted: ${filePath}`);
            }
        } catch (cleanupErr) {
            console.error('Error cleaning up file:', cleanupErr.message);
        }
    }
});

module.exports = router;
