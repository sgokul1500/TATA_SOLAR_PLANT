const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

// Endpoint to handle the /api/generate-curve request
app.post('/api/generate-curve', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }

  const filePath = path.resolve(req.file.path);
  const { incrementalDcCapacity, startDate, endDate } = req.body;

  // Prepare parameters to pass to the Python script
  const params = {
    incremental_gen_list: [incrementalDcCapacity], // Convert this to an array if you have multiple capacities
    start_date: startDate,
    end_date: endDate,
  };

  // Spawn Python process to handle the file processing
  const pythonProcess = spawn('python', ['process_pdf.py', JSON.stringify(params)]); // Changed 'python3' to 'python'

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    // Clean up uploaded file after processing
    try {
      require('fs').unlinkSync(filePath);
    } catch (err) {
      console.error('Error deleting uploaded file:', err);
    }

    if (code !== 0) {
      console.error('Python script error:', errorOutput);
      return res.status(500).json({ message: 'Error processing file', error: errorOutput });
    }

    try {
      const jsonOutput = JSON.parse(output);
      res.status(200).json(jsonOutput);
    } catch (err) {
      res.status(500).json({ message: 'Error parsing Python output', error: err.message });
    }
  });
});

// Default server response
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
