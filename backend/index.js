import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/posts.js';
import allPostRoutes from './routes/allPosts.js';
import singlePostRoutes from './routes/singlePost.js';
import commentRoutes from './routes/comments.js';
import userPostsRoutes from './routes/userPosts.js';
import searchRoutes from './routes/search.js';
import findPostRoutes from './routes/findPost.js';
import followRoutes from './routes/follow.js';
import tagRoutes from './routes/tags.js';
import trendRoutes from './routes/trends.js';
import contactRoutes from './routes/contact.js';
import getFollowersRoutes from './routes/getFollowers.js';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes);
app.use('/api/allPosts', allPostRoutes);
app.use('/api/singlePost', singlePostRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/userPosts', userPostsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/findPost', findPostRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/followers', getFollowersRoutes);  

// For ES Modules __dirname fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// ✅ Serve frontend build in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get(/(.*)/, (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running...");
//   });
// }

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
