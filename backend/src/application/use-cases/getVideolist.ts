// ============================================
// GET VIDEOLIST USE CASE
// ============================================
// Business logic layer: fetches all videos
// Implements the "get all videos" feature
// Handles interaction between controller and repository

import iVideoRepository from "../../infraestructure/repositories/iVideoRepository.js";
import type {videolistDTO} from "../DTO/videolistDTO.js";

/**
 * Use case for retrieving all available videos
 * Follows clean architecture pattern
 * Depends on repository interface (not implementation)
 */
export  class getVideolist {
    // Repository injected via constructor (dependency injection)
    private readonly _repo:iVideoRepository;

    /**
     * Constructor - receives repository instance
     * @param repo - Video repository implementing data access
     */
    constructor(repo:iVideoRepository){
        this._repo = repo;
    }

    // Getter to access repository
    get repo(): iVideoRepository {
        return this._repo;
    }

    /**
     * Execute use case - fetch all videos
     * @returns Promise of array of video list DTOs
     */
    async execute():Promise<videolistDTO[]> {
        // Delegate to repository to fetch data
        return this.repo.getVideolist();
    }
}