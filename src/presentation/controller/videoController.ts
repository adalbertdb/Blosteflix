import type {getByTopic} from "../../application/use-cases/getByTopic.js";
import type {getVideolist} from "../../application/use-cases/getVideolist.js";
import type {getById} from "../../application/use-cases/getById.js";

import express from "express";

export class videoController {

    _getByIdUC: getById;
    _getByTopic: getByTopic;
    _getVideolist: getVideolist;


    constructor (getByIdUC : getById, getByTopic : getByTopic, getVideolist : getVideolist) {
        this._getByIdUC = getByIdUC;
        this._getByTopic = getByTopic;
        this._getVideolist = getVideolist;
    }

    /*  TODO => adaptar-ho tot per a un sol endpoint
    parameter= async (req:express.Request, res: express.Response)=>{
        const id = req.params.id;
        const topic = req.params.topic;
        let result;
        if (id != null){
            result = this.idVideo(id);
        }else if (topic != null){
            result = this.topicVideo(topic);
        }else result = this.getVideolist();

    }
    */

    getVideolist = async (req:express.Request, res: express.Response)  => {
        const result = await this._getVideolist.execute();
        res.status(200).send(result)

    }
    idVideo = async (req:express.Request, res: express.Response)=>{
        const result = await this._getByIdUC.execute(req.params.id)
        console.log(result)
        res.status(200).send(result)

    }
    topicVideo = async (req:express.Request, res: express.Response)=>{
        const result = await this._getByTopic.execute(req.params.topic);
        res.status(200).send(result)

    }
}

