// models/UserProfile.js
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  username: { type: String, required: true }, 
  bio: String, 
  instagram: String, 
  facebook: String, 
  twitter: String, 
  branch: String,
  year: String,
  interests: [String],
  followers: [String],
  following: [String],
  profilePic: {
    type:String,
    default: ''
  },
  deleted: { type: Boolean, default: false },
   profileCompleted: {
    type: Boolean,
    default: false
  },
  socials: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
