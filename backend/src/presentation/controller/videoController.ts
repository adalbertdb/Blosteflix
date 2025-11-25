// ============================================
// VIDEO CONTROLLER - REQUEST HANDLER
// ============================================
// Handles HTTP requests for video metadata
// Delegates business logic to use cases
// Returns JSON responses to client

import type {getByTopic} from "../../application/use-cases/getByTopic.js";
import type {getVideolist} from "../../application/use-cases/getVideolist.js";
import type {getById} from "../../application/use-cases/getById.js";

import express from "express";

/**
 * Controller class for video metadata endpoints
 * Uses dependency injection to receive use cases
 */
export class videoController {
    // Use case instances injected via constructor
    _getByIdUC: getById;          // Business logic for fetching by ID
    _getByTopic: getByTopic;      // Business logic for filtering by topic
    _getVideolist: getVideolist;  // Business logic for getting all videos

    /**
     * Constructor - receives use cases via dependency injection
     * @param getByIdUC - Use case for getting video by ID
     * @param getByTopic - Use case for getting videos by topic
     * @param getVideolist - Use case for getting all videos
     */
    constructor (getByIdUC : getById, getByTopic : getByTopic, getVideolist : getVideolist) {
        this._getByIdUC = getByIdUC;
        this._getByTopic = getByTopic;
        this._getVideolist = getVideolist;
    }

    // ============================================
    // ROUTE HANDLERS
    // ============================================

    /**
     * GET /api/videolist
     * Returns all available videos
     */
    getVideolist = async (req:express.Request, res: express.Response)  => {
        const result = await this._getVideolist.execute();
        res.status(200).send(result)
    }

    /**
     * GET /api/videolist/id/:id
     * Returns a specific video by ID
     * @param req.params.id - Video ID to fetch
     */
    idVideo = async (req:express.Request, res: express.Response)=>{
        const result = await this._getByIdUC.execute(req.params.id)
        console.log(result)
        res.status(200).send(result)
    }

    /**
     * GET /api/videolist/topic/:topic
     * Returns all videos with a specific topic
     * @param req.params.topic - Topic to filter by
     */
    topicVideo = async (req:express.Request, res: express.Response)=>{
        const result = await this._getByTopic.execute(req.params.topic);
        res.status(200).send(result)
    }
}

