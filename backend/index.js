// backend/index.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Hello SEO Tool!' });
});

app.listen(port, () => {
  console.log(`Backend Express server running on http://localhost:${port}`);
});
