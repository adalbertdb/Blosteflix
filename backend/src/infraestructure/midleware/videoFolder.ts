// ============================================
// HLS PLAYLIST MIDDLEWARE (M3U8 FILE SERVING)
// ============================================
// Serves HLS playlist files that list video segments
// Example: Converts local "index0.ts" to network URL "/api/videolist/videos/video1/index0.ts"

import type { Request, Response } from 'express';
import path from 'path';
import { promises as fs } from 'fs';

const BASE_FOLDER = 'public/videos';

/**
 * Serves m3u8 playlist files with path rewriting
 * - Reads local m3u8 file
 * - Converts relative segment paths to absolute API URLs
 * - Sets proper HLS headers for streaming
 */
export const serveHlsIndex = async (req: Request, res: Response) => {
    const { videoId } = req.params;
  try {
    // Validate videoId parameter exists
    if (!videoId) return res.status(400).send('ID requerido');

    const filePath = path.resolve(BASE_FOLDER, videoId, 'index.m3u8');

    // SECURITY: Prevent path traversal attacks (e.g., ../../etc/passwd)
    if (!filePath.startsWith(path.resolve(BASE_FOLDER))) {
      return res.status(403).send('Forbidden');
    }

    // Read playlist file from disk
    let content = await fs.readFile(filePath, 'utf-8');

    // CRITICAL: Rewrite relative paths to absolute API URLs
    // Why: Network streams need full URLs to fetch segments
    // Before: index0.ts, index1.ts
    // After:  /api/videolist/videos/video1/index0.ts, /api/videolist/videos/video1/index1.ts
    content = content.replace(
      /^(index\d+\.ts)$/gm,
      `/api/videolist/videos/${videoId}/$1`
    );

    // Also rewrite nested m3u8 references (if any)
    content = content.replace(
      /^([\w-]+\.m3u8)$/gm,
      `/api/videolist/videos/${videoId}/$1`
    );

    console.log('✅ Serving playlist for:', videoId);

    // ============================================
    // SET HTTP HEADERS FOR HLS STREAMING
    // ============================================
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl'); // Tell client this is HLS
    
    // CRITICAL: No-cache headers prevent browser from caching streams
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.setHeader('Content-Length', Buffer.byteLength(content, 'utf-8')); // File size
    
    // CORS headers allow Flutter app to access this endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');

    return res.send(content);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.error('❌ Video not found:', videoId);
      return res.status(404).send('Vídeo no encontrado');
    }
    console.error('❌ Error sirviendo index.m3u8:', err);
    return res.status(500).send('Error interno');
  }
};