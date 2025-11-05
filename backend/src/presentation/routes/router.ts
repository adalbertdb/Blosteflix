import type videoRepository from "../../domain/repositories/videoRepository.js";

export default class router {
    private videoRepository: videoRepository;
    constructor(videoRepository:videoRepository) {
        this.videoRepository = videoRepository;
    }

}