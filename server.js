const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.get('/config.js', (req, res) => {
  // Read the config.js file
  fs.readFile('config.js', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config.js:', err);
      return res.status(500).send('Error reading config.js');
    }

    // Inject the API key into the config.js content
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY not found in environment variables.');
      return res.status(500).send('OPENROUTER_API_KEY not found');
    }
    const modifiedConfig = data.replace('YOUR_API_KEY', apiKey); // Replace placeholder

    // Send the modified config.js
    res.setHeader('Content-Type', 'application/javascript');
    res.send(modifiedConfig);
  });
});

app.use(express.static('.')); // Serve static files (index.html, etc.)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});