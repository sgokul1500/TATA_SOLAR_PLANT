app.post('/api/generate-curve', (req, res) => {
    try {
        const { 
            acCapacity, 
            dcCapacity, 
            incrementalDcCapacity, 
            timeInterval,
            startDate,
            endDate 
        } = req.body;
        
        if (!acCapacity || !dcCapacity || !timeInterval || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const curve = generateSolarCurve(
            parseFloat(acCapacity),
            parseFloat(dcCapacity),
            parseFloat(incrementalDcCapacity),
            parseInt(timeInterval),
            startDate,
            endDate
        );

        res.json(curve);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});