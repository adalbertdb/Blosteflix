import {getByTopic} from "../../application/use-cases/getByTopic.js";
import type {getVideolist} from "../../application/use-cases/getVideolist.js";
import type {getById} from "../../application/use-cases/getById.js";
// @ts-ignore
import express from "express";
export declare class videoController {
    _getByIdUC: getById;
    _getByTopic: getByTopic;
    _getVideolist: getVideolist;
    constructor(getByIdUC: getById, getByTopic: getByTopic, getVideolist: getVideolist);
    getVideolist: (req: express.Request, res: express.Response) => Promise<void>;
    getById: (req: express.Request, res: express.Response) => Promise<void>;
    getByTopic: (req: express.Request, res: express.Response) => Promise<void>;
}
//# sourceMappingURL=videoController.d.ts.map