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

//Repository
const repo = new VideoRepository()
// UseCases
const videolistUC = new getVideolist(repo)
const idUC = new getById(repo);
const topicUC = new getByTopic(repo);
//Controller
const controller = new videoController(idUC,topicUC,videolistUC)
//Router
const videoRouter = createVideoListRouter;

// App Setup
const app = express();
app.use(express.json());

// CORS middleware for video streaming
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Range');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// HLS video streaming routes - ORDER MATTERS!
// Route for main playlist (both with and without .m3u8 extension)
app.get('/api/videolist/videos/:videoId/index.m3u8', serveHlsIndex);
app.get('/api/videolist/videos/:videoId', serveHlsIndex);

// Regex route for video segments: captures videoId in group 1, filename path in group 2
app.get(/^\/api\/videolist\/videos\/([^\/]+)\/(.+)$/, (req, res, next) => {
  req.params.videoId = req.params[0]; // Extract from regex group 1
  req.params.fileName = req.params[1]; // Extract from regex group 2
  serveHlsSegments(req, res);
});

app.use('/api/videolist', videoRouter(controller));

// Servimos los archivos que se encuentran en el directorio public
app.use(express.static(path.join('public/videos/')));

// Port express
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/api/videolist`);
});