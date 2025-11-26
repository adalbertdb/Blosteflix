import express from 'express';
import { createVideoListRouter } from './presentation/routes/router.js';
import { videoController } from './presentation/controller/videoController.js';
import {getById} from './application/use-cases/getById.js';
import {getByTopic} from './application/use-cases/getByTopic.js';
import {getVideolist} from './application/use-cases/getVideolist.js';
import VideoRepository from "./infraestructure/repositories/iVideoRepository.js";
import path from "node:path";

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
app.use('/api/videolist', videoRouter(controller));

// Servimos los archivos que se encuentran en el directorio public
app.use(express.static(path.join('public/videos/')));

// Port express
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/api/videolist`);
});