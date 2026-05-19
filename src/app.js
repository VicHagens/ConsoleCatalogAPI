const express = require('express');
const app = express(); // Create Express application
const port = 3000;

// greeting home route
app.get('/', (req, res) => {
    res.send('Welcome to the ConsoleCatalog API by Vic Hagens!');
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

module.exports = app;