import videoRepository from "../../domain/repositories/videoRepository.js";
export default class iVideoRepository extends videoRepository {
    getById(videoId) {
        super.getById(videoId);
    }
    getByTopic(topic) {
        super.getByTopic(topic);
    }
    getVideolist() {
        super.getVideolist();
    }
}
//# sourceMappingURL=iVideoRepository.js.map