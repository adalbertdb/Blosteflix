// ============================================
// VIDEO ENTITY - DOMAIN MODEL
// ============================================
// Represents a video in the domain layer
// Pure business logic with no framework dependencies

/**
 * Video entity class
 * Represents a single video with all its properties
 * Used throughout the application to pass video data
 */
export default class video {
    // Private properties - encapsulation
    private _id: string;              // Unique identifier
    private _topic : string;          // Video category/topic
    private _description : string;    // Video description
    private _duration: number;        // Length in seconds
    private _thumbnail: string;       // Thumbnail image filename
    private _url:string;              // Streaming URL

    /**
     * Constructor - initializes all video properties
     * @param id - Unique video identifier (e.g., "video1")
     * @param topic - Video category (e.g., "Hardware")
     * @param description - Text description of the video
     * @param duration - Video length in seconds
     * @param thumbnail - Image filename for thumbnail
     * @param url - HLS streaming URL
     */
    constructor(id: string, topic: string, description: string, duration: number, thumbnail: string, url:string) {
        this._id = id;
        this._topic = topic;
        this._description = description;
        this._duration = duration;
        this._thumbnail = thumbnail;
        this._url = url;
    }

    // ============================================
    // GETTERS - Read-only access to properties
    // ============================================
    
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