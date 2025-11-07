import videoRepository from "../../domain/repositories/videoRepository.js";
import {videolistMapper} from "../mappers/videolistMapper.js";
import video from '../../domain/entities/video.js'
import {readFileSync} from "node:fs";
import type {videolistDTO} from "../../application/DTO/videolistDTO.js";

export default class iVideoRepository extends videoRepository{

    getById(videoId: string) {
    }

    getByTopic(topic: string) {
    }

    getVideolist():videolistDTO[] {
        console.log("getVideolist");


        const data = readFileSync("src/infraestructure/data-sources/videos.json", "utf-8");
        const videos: video[] = JSON.parse(data);
        console.log("datos");


        const videolist: videolistDTO[] = [];

        videos.forEach(video => {
            videolist.push(<videolistDTO>videolistMapper.toVideoList(video));
        })
        console.log(videolist);

        return videolist;
    }
}
