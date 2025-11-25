// presentation/routes/router.ts
import type { videoController } from '../controller/videoController.js';
import{Router} from 'express';
import {serveHlsIndex} from "../../infraestructure/midleware/videoFolder.js";
import {serveHlsSegments} from "../../infraestructure/midleware/videoSegments.js";

export const createVideoListRouter = (controller: videoController): Router => {
    const router  = Router();

    // GET /api/videolist/:topic
    router.get('/topic/:topic', controller.topicVideo.bind(controller));

    // GET /api/videolist
    router.get('/', controller.getVideolist.bind(controller));

    // GET /api/videolist/:id
    router.get('/id/:id', controller.idVideo.bind(controller));

    return router;
};