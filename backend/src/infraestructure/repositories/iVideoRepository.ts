import videoRepository from "../../domain/repositories/videoRepository.js";
import {videolistMapper} from "../mappers/videolistMapper.js";
import video from '../../domain/entities/video.js'
import {readFileSync} from "node:fs";
import type {videolistDTO} from "../../application/DTO/videolistDTO.js";
import {json} from "node:stream/consumers";

export default class iVideoRepository extends videoRepository{

    static  data = readFileSync("src/infraestructure/data-sources/videos.json", "utf-8");
    static videos: video[] = JSON.parse(iVideoRepository.data);

    getById(videoId: string):video {
        let result = new video("null","null","null",0,"null","null")
        iVideoRepository.videos.forEach(vid => {
            if (vid.id == videoId) {
                result = vid;
            }
        })
        return result;

    }

    getByTopic(topic: string) {
        let videosTopic: video[] = [];

        iVideoRepository.videos.forEach(video => {
            if (video.topic == topic){
                videosTopic.push(video);
            }
        })

        if (videosTopic.length > 0){
            return videosTopic;
        }else throw new Error("There is no videos with that topic")

    }

    getVideolist():videolistDTO[] {

        const videolist: videolistDTO[] = [];

        iVideoRepository.videos.forEach(video => {
            videolist.push(<videolistDTO>videolistMapper.toVideoList(video));
        })

        return videolist;
    }
}
