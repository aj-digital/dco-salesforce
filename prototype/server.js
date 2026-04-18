const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main application HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Catch-all to redirect back to main app
app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`DCO Prototype running at http://localhost:${port}`);
});
