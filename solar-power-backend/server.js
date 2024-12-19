const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In server.js
// In server.js
function generateSolarCurve(acCapacity, dcCapacity, timeInterval) {
    const values = [];
    const clippedValues = [];
    const labels = [];
    const hours = 24;
    const intervals = Math.floor(hours * 60 / timeInterval);

    for (let i = 0; i < intervals; i++) {
        const time = (i * timeInterval) / 60; // Convert to hours
        const label = `${Math.floor(time)}:${(time % 1 * 60).toFixed(0).padStart(2, '0')}`;
        labels.push(label);

        // Generate bell curve for daylight hours (6am to 6pm)
        let value = 0;
        if (time >= 6 && time <= 18) {
            // Create bell curve centered at noon (12:00)
            const normalizedTime = (time - 12) / 6; // Center at noon
            value = dcCapacity * Math.exp(-(normalizedTime * normalizedTime));
            
            // Store original value before clipping
            values.push(value);
            // Store clipped value
            clippedValues.push(Math.min(value, acCapacity));
        } else {
            values.push(0);
            clippedValues.push(0);
        }
    }

    return { labels, values, clippedValues };
}

app.post('/api/generate-curve', (req, res) => {
    try {
        const { acCapacity, dcCapacity, timeInterval } = req.body;
        
        if (!acCapacity || !dcCapacity || !timeInterval) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const curve = generateSolarCurve(
            parseFloat(acCapacity),
            parseFloat(dcCapacity),
            parseInt(timeInterval)
        );

        res.json(curve);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/generate-curve', (req, res) => {
    try {
        const { acCapacity, dcCapacity, timeInterval } = req.body;
        
        if (!acCapacity || !dcCapacity || !timeInterval) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const curve = generateSolarCurve(
            parseFloat(acCapacity),
            parseFloat(dcCapacity),
            parseInt(timeInterval)
        );

        res.json({
            labels: curve.labels,
            values: curve.values,
            shoulder_area: curve.values.reduce((a, b) => a + b, 0)
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});