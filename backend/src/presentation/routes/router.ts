// ============================================
// ROUTER - API ENDPOINT DEFINITIONS
// ============================================
// Defines all video metadata API routes (separate from HLS streaming routes)
// These routes return JSON data about videos
// HLS streaming routes are defined in index.ts

import type { videoController } from '../controller/videoController.js';
import{Router} from 'express';
import {serveHlsIndex} from "../../infraestructure/midleware/videoFolder.js";
import {serveHlsSegments} from "../../infraestructure/midleware/videoSegments.js";

/**
 * Creates Express router with video metadata endpoints
 * @param controller - Video controller instance with business logic
 * @returns Router with all video API endpoints
 */
export const createVideoListRouter = (controller: videoController): Router => {
    const router  = Router();

    // ============================================
    // ROUTE 1: GET /api/videolist/topic/:topic
    // ============================================
    // Get all videos with a specific topic
    // Example: GET /api/videolist/topic/Hardware
    // Returns: Array of videos with that topic
    router.get('/topic/:topic', controller.topicVideo.bind(controller));

    // ============================================
    // ROUTE 2: GET /api/videolist
    // ============================================
    // Get all available videos (no filtering)
    // Returns: Array of all videos with metadata
    router.get('/', controller.getVideolist.bind(controller));

    // ============================================
    // ROUTE 3: GET /api/videolist/id/:id
    // ============================================
    // Get a specific video by ID
    // Example: GET /api/videolist/id/video1
    // Returns: Single video object with full details
    router.get('/id/:id', controller.idVideo.bind(controller));

    return router;
};