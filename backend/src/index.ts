// ============================================
// BLOSTEFLIX VIDEO SERVER - MAIN ENTRY POINT
// ============================================
// This file sets up the Express server with HLS (HTTP Live Streaming) support
// for video playback on Android/iOS devices

import express from 'express';
import { createVideoListRouter } from './presentation/routes/router.js';
import { videoController } from './presentation/controller/videoController.js';
import {getById} from './application/use-cases/getById.js';
import {getByTopic} from './application/use-cases/getByTopic.js';
import {getVideolist} from './application/use-cases/getVideolist.js';
import VideoRepository from "./infraestructure/repositories/iVideoRepository.js";
import path from "node:path";
import { serveHlsIndex } from './infraestructure/midleware/videoFolder.js';
import { serveHlsSegments } from './infraestructure/midleware/videoSegments.js';

// ============================================
// DEPENDENCY INJECTION SETUP
// ============================================
// Initialize repository for database access
const repo = new VideoRepository()

// Create use case instances (business logic layer)
const videolistUC = new getVideolist(repo)  // Get all videos
const idUC = new getById(repo);              // Get video by ID
const topicUC = new getByTopic(repo);        // Get videos by topic

// Create controller instance (handles HTTP requests)
const controller = new videoController(idUC,topicUC,videolistUC)

// Router factory
const videoRouter = createVideoListRouter;

// ============================================
// EXPRESS APP INITIALIZATION
// ============================================
const app = express();
app.use(express.json());

// ============================================
// CORS MIDDLEWARE - Enable cross-origin requests
// ============================================
// Required for Flutter app to communicate with backend
// Specifically allows Range headers needed for video seeking
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');           // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow GET and OPTIONS methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Range'); // Allow these headers
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ============================================
// HLS VIDEO STREAMING ROUTES
// ============================================
// NOTE: Route order matters! More specific routes must come first

// Route 1: Explicit .m3u8 request
// Example: GET /api/videolist/videos/video1/index.m3u8
// Purpose: ExoPlayer (Android) requires .m3u8 extension to recognize HLS streams
app.get('/api/videolist/videos/:videoId/index.m3u8', serveHlsIndex);

// Route 2: Generic playlist request (backward compatibility)
// Example: GET /api/videolist/videos/video1
// Purpose: Supports URLs without .m3u8 extension
app.get('/api/videolist/videos/:videoId', serveHlsIndex);

// Route 3: Video segment streaming (regex route for dynamic filenames)
// Example: GET /api/videolist/videos/video1/index0.ts
// Pattern: Regex captures videoId and filename to serve individual video chunks
// Why regex: Allows streaming of any .ts or .m3u8 file dynamically
app.get(/^\/api\/videolist\/videos\/([^\/]+)\/(.+)$/, (req, res, next) => {
  // Extract parameters from regex capture groups:
  req.params.videoId = req.params[0]; // Regex group 1: videoId (e.g., "video1")
  req.params.fileName = req.params[1]; // Regex group 2: fileName (e.g., "index0.ts")
  serveHlsSegments(req, res);
});

// ============================================
// API ROUTES FOR VIDEO METADATA
// ============================================
// Routes: /api/videolist, /api/videolist/topic/:topic, /api/videolist/id/:id
app.use('/api/videolist', videoRouter(controller));

// ============================================
// STATIC FILE SERVING
// ============================================
// Serve video files directly from public/videos/ directory
// Fallback for requests not matched by other routes
app.use(express.static(path.join('public/videos/')));

// ============================================
// SERVER STARTUP
// ============================================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${port}/api/videolist`);
});