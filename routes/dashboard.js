const express = require('express');
const router = express.Router();

// Define a route for rendering the dashboard page
router.get('/', (req, res) => {
  res.render('dashboard'); // Render the "dashboard.ejs" view
});

module.exports = router;
