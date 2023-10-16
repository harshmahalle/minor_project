const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const ensureAuthenticated = require('./routes/authMiddleware');
const dashboardRoutes = require('./routes/dashboard');
const users = [];

// Initialize Passport and express-session
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(
  function(email, password, done) {
    // Replace this with actual database or user data validation logic
    if (email === 'user' && password === 'password') {
      return done(null, { id: 1, email: 'user' });
    } else {
      return done(null, false, { message: 'Incorrect email or password' });
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.email); // Serialize by email
});

passport.deserializeUser(function(email, done) {
  // Replace this with actual user data retrieval logic
  if (email === 'user') {
    return done(null, { id: 1, email: 'user' }); // Deserialize by email
  } else {
    return done(null, false);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Registration
app.post('/register', (req, res) => {
  const { name, age, email, password } = req.body;

  // Check if the email is already registered
  if (users.some(user => user.email === email)) {
    // Redirect back to the registration page with an error message
    return res.redirect('/register?error=Email%20already%20in%20use');
  }

  // Create a new user object with the added "name" and "age" fields
  const newUser = {
    name,
    age,
    email,
    password,
  };

  // Push the user object into the users array
  users.push(newUser);

  // Redirect to the login page for simplicity
  res.redirect('/login');
});

// Create a route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle the login post request
app.post('/login', passport.authenticate('local', {
  successRedirect: 'http://localhost:3000/dashboard.html', // Redirect to the dashboard on successful login
  failureRedirect: '/login', // Redirect back to the login page on failed login
  failureFlash: true
}));

// Logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Dashboard route
app.use('/dashboard', ensureAuthenticated, dashboardRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



