import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  
    },
    title: {
        type: String,
        required: true,  
    },
    content: {
        type: String,
        required: true,  
    },
    imageUrl: {
        type: String,  // Change to String to store the image path
    },
    createdAt: {    
        type: Date,
        default: Date.now 
    },
    likes: {
        type: Number,
        default: 0      
    },
    city: {
        type: String,
        required: true   
    }
});

export default mongoose.model('Post', PostSchema);
