import express from 'express';
import passport from 'passport';
import User from '../model/User.js';

const router = express.Router();

router.get("/" , (req,res) => {
    res.render('index');
})

router.get('/register', checkAuthenticated ,(req, res) => {
    res.render('login');
});


router.post('/register', async (req, res) => {
    const { name, email, password, city } = req.body;
    try {
        const newUser = new User({ name, email, city });
        await User.register(newUser, password);  // Hashing and saving password
        res.redirect('/login');  // Redirect to login after successful registration
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
});


router.get('/login', checkAuthenticated , (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
}));


router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));


router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/login',
}));


router.get('/profile', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    try {
        // Populate the posts associated with the user
        const userWithPosts = await User.findById(req.user._id).populate('posts');

        // Render the profile page with the user and their posts
        res.render('profile', { user: userWithPosts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/profile');  // Redirect if user is already authenticated
    }
    next();  // Continue to the next middleware/route if not authenticated
}

export default router;
