import express from 'express';
import session from 'express-session';
import passport from 'passport';
import router from './routes/userRoute.js';
import route from './routes/postRoute.js';
import dotenv from 'dotenv';
import './config/passport.js';  // Passport configuration


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));



// Session management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up view engine (EJS)
app.set('view engine', 'ejs');

// Use routes
app.use("/", router);
app.use("/", route);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
