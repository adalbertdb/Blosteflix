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


    getVideolist = async (req:express.Request, res: express.Response)  => {
        const result = await this._getVideolist.execute();
        res.status(200).send(result);
    }
    getById = async (req:express.Request, res: express.Response)=>{}
    getByTopic = async (req:express.Request, res: express.Response)=>{}






}

