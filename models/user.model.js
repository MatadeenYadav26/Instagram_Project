const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Username already exists'],
        required: [true, 'Username is required']
    },
    
        email: {
            type: String,
            unique: [true, 'Email already exists'],
            required: [true, 'Email is required']
    },

        password: {
            type: String,
            required: [true, 'Password is required']
    },
    bio:String,
    profilePicture: {
        type: String,
        default: "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg?semt=ais_hybrid&w=740&q=80"
    }

})



const userModel = mongoose.model("users",userSchema)

module.exports = userModel