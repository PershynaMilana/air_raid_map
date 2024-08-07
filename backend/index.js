const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.static('public'));

let cachedData = null;

const fetchAlerts = async () => {
    try {
        const response = await fetch('http://ubilling.net.ua/aerialalerts/?json=true');
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        cachedData = await response.json();
        console.log('Fetched data:', cachedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

setInterval(fetchAlerts, 3000);

app.get('/api/alerts', (req, res) => {
    if (cachedData) {
        res.json(cachedData);
    } else {
        res.status(500).send('No data available');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});