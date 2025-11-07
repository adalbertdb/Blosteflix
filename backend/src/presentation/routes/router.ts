// presentation/routes/router.ts
import type { videoController } from '../controller/videoController.js';
import {Router} from 'express';

export const createVideoListRouter = (controller: videoController): Router => {
    const router  = Router();

    // GET /api/videolist/:topic
    router.get('/topic/:topic', controller.getByTopic.bind(controller));

    // GET /api/videolist
    router.get('/', controller.getVideolist.bind(controller));

    // GET /api/videolist/:id
    router.get('/id/:id', controller.getById.bind(controller));

    console.log()

    return router;
};