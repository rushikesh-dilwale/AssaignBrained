// server.js

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());

// Connect to MongoDB (you need to have MongoDB installed and running)
mongoose.connect('mongodb+srv://rushidilwale19:rushidilwale19@cluster0.kp0sjan.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a MongoDB model for your posts
const Post = mongoose.model('Post', {
  name: String,
  description: String,
  imageUrl: String,
});

// Express routes for handling post operations
app.post('/api/posts', async (req, res) => {
    console.log('sadsfds',req.body)
  try {
    const { name, description, imageUrl } = req.body;

    // Save post data to the database
    await Post.create({ name, description, imageUrl });

    res.status(201).send('Post created successfully');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/api/posts/:postId', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    // Update post data in the database
    await Post.findByIdAndUpdate(req.params.postId, { name, description, imageUrl });

    res.status(200).send('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/posts/:postId', async (req, res) => {
  try {
    // Delete post from the database
    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).send('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
