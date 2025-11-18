import express from "express";
export class videoController {
    _getByIdUC;
    _getByTopic;
    _getVideolist;
    constructor(getByIdUC, getByTopic, getVideolist) {
        this._getByIdUC = getByIdUC;
        this._getByTopic = getByTopic;
        this._getVideolist = getVideolist;
    }
    getVideolist = async (req, res) => { };
    getById = async (req, res) => { };
    getByTopic = async (req, res) => { };
}
//# sourceMappingURL=videoController.js.map