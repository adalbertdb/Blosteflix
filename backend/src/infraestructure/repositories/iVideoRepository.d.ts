import videoRepository from "../../domain/repositories/videoRepository.js";
export default class iVideoRepository extends videoRepository {
    getById(videoId: number): void;
    getByTopic(topic: String): void;
    getVideolist(): void;
}
//# sourceMappingURL=iVideoRepository.d.ts.map