// ../domain/repositories/repository.ts
import type { videolistDTO } from "../../application/DTO/videolistDTO.js";
import type Video from "../entities/video.js";

export default class VideoRepository {
    getById(videoId: string){
        throw new Error("Not implemented");
    }

    getByTopic(topic: string){
        throw new Error("Not implemented");
    }

    getVideolist(): videolistDTO[] {
        throw new Error("Clase abstracta");
    }
}