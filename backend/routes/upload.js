const express = require('express');
const path = require('path');
const { processFile } = require('../services/pythonRunner');

const router = express.Router();

router.post('/', async (req, res) => {
    console.log('File upload endpoint hit'); // Log the route access
    if (!req.files || !req.files.file) {
        console.log('No file uploaded');
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const filePath = path.join(__dirname, '../../uploads', file.name);
    console.log(`File received: ${file.name}`);

    // Save file and process it
    try {
        await file.mv(filePath);
        console.log(`File saved to: ${filePath}`);
        const result = await processFile(filePath);
        console.log('Processing result:', result);
        res.json({ distances: result });
    } catch (err) {
        console.error('Error processing file:', err.message);
        res.status(500).send(`Error processing file: ${err.message}`);
    }
});

module.exports = router;
