const express = require('express');
const path = require('path'); // For working with file paths
const app = express();
const port = process.env.PORT || 3000; // You can choose your preferred port number

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine and views directory (assuming you're using EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define routes (we'll add more routes in future steps)
app.use('/dashboard', require('./routes/dashboard'));

// Set up the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
