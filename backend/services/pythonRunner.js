const { spawn } = require('child_process');
const path = require('path');

function processFile(filePath) {
    return new Promise((resolve, reject) => {
        // Dynamically resolve the path to the Python script
        const scriptPath = path.resolve(__dirname, '../scripts/distance_calculator.py'); 
        console.log(`Running Python script: ${scriptPath} with file: ${filePath}`);
        
        // Spawn a Python process to execute the script with the provided file
        const python = spawn('python3', [scriptPath, `"${filePath}"`], { shell: true });


        let output = '';
        let errorOutput = '';

        // Capture standard output from the Python script
        python.stdout.on('data', (data) => {
            console.log(`Python stdout: ${data}`);
            output += data.toString();
        });

        // Capture standard error output from the Python script
        python.stderr.on('data', (data) => {
            console.error(`Python stderr: ${data}`);
            errorOutput += data.toString();
        });

        // Handle the process closing
        python.on('close', (code) => {
            console.log(`Python script exited with code: ${code}`);
            if (code === 0) {
                try {
                    const result = JSON.parse(output); // Parse JSON output from Python
                    resolve(result); // Resolve the promise with the result
                } catch (err) {
                    console.error('Error parsing Python output:', err.message);
                    reject('Error parsing Python output');
                }
            } else {
                console.error('Python script failed:', errorOutput || 'Unknown error');
                reject(errorOutput || 'Python script failed');
            }
        });

        // Handle unexpected process errors
        python.on('error', (err) => {
            console.error('Failed to start Python process:', err.message);
            reject('Failed to start Python process');
        });
    });
}

module.exports = { processFile };
