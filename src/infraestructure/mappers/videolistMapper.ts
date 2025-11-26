// interface/mappers/VideoResponseMapper.ts
import video  from "../../domain/entities/video.js";

export class videolistMapper {
    static toVideoList(video:video) {
        return {
            id: video.id,
            topic: video.topic,
            thumbnail: video.thumbnail
        };
    }

}
