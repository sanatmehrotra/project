import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/project"); 


const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: false,   
        
    },
    name: {
        type: String,
        required: false,   
        
    },
    email: {
        type: String,
        required: true,       
        unique: true,      
        
    },
    city: {
        type: String,
        required: false,   
    },
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }],
      dp: {
        type: String,
        default: ''
      },

});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
});

export default mongoose.model('User', UserSchema);
