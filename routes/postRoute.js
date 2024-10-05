import express from 'express'; 
import Post from '../model/Post.js';
import multer from 'multer';
import path from 'path';

const route = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    },
});

const upload = multer({ storage });

// Feed route to display posts based on user's city
route.get('/feed', ensureAuthenticated, async (req, res) => {
    let posts = [];
    if (req.user.city) {
        posts = await Post.find({ city: req.user.city }).populate('user');
    }
    res.render('feed', { user: req.user, posts });
});

// Post creation route (with image upload)
route.post('/post', ensureAuthenticated, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const imageUrl = req.file ? req.file.filename : ''; // Use the file name here or adjust as needed

    if (!req.user.city) {
        return res.redirect('/feed');
    }

    try {
        const post = new Post({
            user: req.user._id,
            title,
            content,
            imageUrl, // Store the image filename
            city: req.user.city,
        });

        await post.save();
        res.redirect('/feed');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while saving the post.'); // Better error handling
    }
});

// Post deletion route
route.post('/post/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.user.toString() !== req.user._id.toString()) {
            return res.redirect('/feed');
        }

        await post.deleteOne();
        res.redirect('/feed');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while deleting the post.'); // Better error handling
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// User profile update route
route.post('/profile/update', ensureAuthenticated, async (req, res) => {
    const { name, city, dp } = req.body;

    try {
        await User.findByIdAndUpdate(req.user._id, { name, city, dp });
        res.redirect('/profile');
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while updating the profile.'); // Better error handling
    }
});

// Set user city route
route.post('/set-city', ensureAuthenticated, async (req, res) => {
    const { city } = req.body;

    try {
        req.user.city = city;
        await req.user.save();
        res.redirect('/feed');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while setting the city.'); // Better error handling
    }
});

export default route; 
