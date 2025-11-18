export default class video {
    private _id: string;
    private _topic : string;
    private _description : string;
    private _duration: number;
    private _thumbnail: string;
    private _url:string;


    constructor(id: string, topic: string, description: string, duration: number, thumbnail: string,url:string) {
        this._id = id;
        this._topic = topic;
        this._description = description;
        this._duration = duration;
        this._thumbnail = thumbnail;
        this._url = url;
    }
    get id(): string {
        return this._id;
    }

    get topic(): string {
        return this._topic;
    }

    get description(): string {
        return this._description;
    }

    get duration(): number {
        return this._duration;
    }

    get thumbnail(): string {
        return this._thumbnail;
    }
    get url():string{
        return this._url;
    }
}