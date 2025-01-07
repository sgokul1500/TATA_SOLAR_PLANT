const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/generate-curve', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { incrementalDcCapacity, startDate, endDate } = req.body;
        
        // Convert the incrementalDcCapacity to a list as required by Python code
        const incremental_gen_list = [parseFloat(incrementalDcCapacity)];

        // Prepare parameters for Python script
        const params = {
            start_date: startDate,
            end_date: endDate,
            incremental_gen_list: incremental_gen_list
        };

        // Spawn Python process
        const pythonProcess = spawn('python', ['scripts/gen_curve.py', JSON.stringify(params)]);

        let result = '';
        let errorData = '';

        // Send file data to Python script
        pythonProcess.stdin.write(req.file.buffer);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script error:', errorData);
                return res.status(500).json({ error: 'Error processing data' });
            }
            try {
                const jsonResult = JSON.parse(result);
                res.json(jsonResult);
            } catch (error) {
                res.status(500).json({ error: 'Error parsing results' });
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});