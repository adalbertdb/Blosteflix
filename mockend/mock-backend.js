// mock-backend.js
// Single-file mock backend for Netflix-like app using Node.js + Express
// Run with: node mock-backend.js
// Access at: http://localhost:3000/api/videolist

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'videos-data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data file exists with initial videos
function initializeData() {
  const initialData = [
    {
      id: "big-buck-bunny",
      topic: "animation",
      description: "Big Buck Bunny is a short computer animated comedy film by the Blender Institute. It features a large rabbit who gets revenge on three rodents.",
      duration: 604.12,
      thumbnail: "https://peach.blender.org/wp-content/uploads/big_buck_bunny_poster.jpg"
    },
    {
      id: "sintel",
      topic: "animation",
      description: "Sintel is a fantasy CGI film about a girl who befriends a baby dragon and goes on a journey to find it after it's taken.",
      duration: 888.45,
      thumbnail: "https://mango.blender.org/wp-content/uploads/2010/09/sintel_poster.jpg"
    },
    {
      id: "elephants-dream",
      topic: "experimental",
      description: "Elephants Dream is the world's first open movie, made entirely with open source graphics software. It explores surreal themes in a strange world.",
      duration: 653.78,
      thumbnail: "https://orange.blender.org/wp-content/uploads/elephants_dream_poster.jpg"
    }
  ];

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('videos-data.json created with initial data');
  }
}

// Load videos from file
function loadVideos() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data file:', err.message);
    return [];
  }
}

// Save videos to file
function saveVideos(videos) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2));
    console.log('Data saved to videos-data.json');
  } catch (err) {
    console.error('Error saving data:', err.message);
  }
}

// Initialize data on startup
initializeData();

// === API ENDPOINTS ===

// GET /api/videolist - List all videos (id, topic, duration, thumbnail)
app.get('/api/videolist', (req, res) => {
  const videos = loadVideos();
  const list = videos.map(v => ({
    id: v.id,
    topic: v.topic,
    duration: v.duration,
    thumbnail: v.thumbnail
  }));
  res.json(list);
});

// GET /api/videolist/:topic - Get all videos by topic (full info)
app.get('/api/videolist/:topic', (req, res) => {
  const { topic } = req.params;
  const videos = loadVideos();
  const filtered = videos.filter(v => v.topic.toLowerCase() === topic.toLowerCase());

  if (filtered.length === 0) {
    return res.status(404).json({ error: `No videos found for topic: ${topic}` });
  }

  res.json(filtered);
});

// GET /api/videolist/:id - Get full video info by ID
app.get('/api/videolist/:id', (req, res) => {
  const { id } = req.params;
  const videos = loadVideos();
  const video = videos.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({ error: `Video not found: ${id}` });
  }

  res.json(video);
});

// Optional: POST /api/videolist - Add new video (for testing)
app.post('/api/videolist', (req, res) => {
  const newVideo = req.body;

  if (!newVideo.id || !newVideo.topic || !newVideo.description || !newVideo.duration || !newVideo.thumbnail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const videos = loadVideos();
  if (videos.some(v => v.id === newVideo.id)) {
    return res.status(400).json({ error: 'Video ID already exists' });
  }

  videos.push(newVideo);
  saveVideos(videos);
  res.status(201).json(newVideo);
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock Netflix backend running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET  /api/videolist`);
  console.log(`  GET  /api/videolist/:topic`);
  console.log(`  GET  /api/videolist/:id`);
  console.log(`  POST /api/videolist (optional)`);
  console.log(`\nData file: ${DATA_FILE}`);
});