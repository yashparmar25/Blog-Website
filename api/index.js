const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config();

const app = express();

// Log to confirm MONGO_URL is loaded
console.log("MONGO_URL:", process.env.MONGO_URL);

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URL, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true
    });
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

// Routes
const UserRoutes = require('./routes/user.route');
app.use("/api/user", UserRoutes);

const AuthRoutes = require('./routes/auth.route');
app.use("/api/auth", AuthRoutes);

const PostRoutes = require('./routes/post.route');
app.use("/api/post", PostRoutes);

const CommentRoutes = require('./routes/comment.route');
app.use("/api/comment", CommentRoutes);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at port no. ${PORT}`);
});
