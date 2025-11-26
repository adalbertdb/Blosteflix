// ============================================
// HLS VIDEO SEGMENT MIDDLEWARE
// ============================================
// Serves individual video segment files (.ts files)
// Supports HTTP Range requests for seeking
// Example: Serves /api/videolist/videos/video1/index0.ts

import { Request, Response } from 'express';
import path from 'path';
import { createReadStream, existsSync, statSync } from 'fs';

const BASE = path.resolve('public/videos');

/**
 * Serves video segment files with Range request support
 * - Handles HTTP Range headers for seeking (206 Partial Content)
 * - Streams file without loading into memory
 * - Sets proper video MIME types
 */
export const serveHlsSegments = (req: Request, res: Response) => {
  // Get parameters extracted by the regex route handler in index.ts
  const videoId = req.params.videoId || '';
  const fileName = req.params.fileName || '';

  console.log('=== SEGMENT REQUEST ===');
  console.log('Full URL:', req.url);
  console.log('videoId:', videoId);
  console.log('fileName:', fileName);

  // Validate both parameters are present
  if (!videoId || !fileName) {
    console.log('❌ Missing videoId or fileName');
    return res.status(400).send('Missing videoId or fileName');
  }

  const filePath = path.join(BASE, videoId, fileName);
  console.log('Resolved file path:', filePath);
  console.log('File exists?', existsSync(filePath));

  // SECURITY: Prevent path traversal attacks
  // Ensures file stays within BASE directory (can't access ../../../etc/passwd)
  if (!filePath.startsWith(BASE)) {
    console.log('❌ Path traversal attempt blocked');
    return res.status(403).send('Forbidden');
  }

  // Check if file exists
  if (!existsSync(filePath)) {
    console.log('❌ File not found:', filePath);
    return res.status(404).send('File not found');
  }

  try {
    // Get file size for Range request handling
    const stat = statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range; // May contain \"bytes=0-1024\"

    // ============================================
    // SET CONTENT-TYPE BASED ON FILE EXTENSION
    // ============================================
    if (fileName.endsWith('.ts')) {
      // MPEG Transport Stream format (video chunks)
      res.setHeader('Content-Type', 'video/mp2t');
    } else if (fileName.endsWith('.m3u8')) {
      // HLS Playlist format (text)
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    }

    // ============================================
    // SET STREAMING HEADERS
    // ============================================
    // Tell client we support Range requests (enables seeking)
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Prevent caching - video streams are dynamic
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // ============================================
    // HANDLE HTTP RANGE REQUESTS
    // ============================================
    // Range requests allow seeking in video player
    // Example: \"Range: bytes=0-1024\" means \"give me first 1025 bytes\"
    // Returns HTTP 206 Partial Content instead of 200 OK
    
    if (range) {
      console.log('📋 Range request detected:', range);
      
      // Parse Range header: \"bytes=START-END\"
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Validate range is within file bounds
      if (start >= fileSize) {
        res.status(416).send('Requested Range Not Satisfiable');
        console.log('❌ Invalid range: start >= fileSize');
        return;
      }

      // Send HTTP 206 (Partial Content) with the requested byte range
      const chunksize = end - start + 1;
      res.status(206); // 206 = Partial Content
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunksize);
      
      console.log(`✅ Serving range bytes ${start}-${end} of ${fileSize}`);

      // Stream only the requested bytes (start to end)
      const stream = createReadStream(filePath, { start, end });
      stream.pipe(res);
      
    } else {
      // ============================================
      // NO RANGE REQUEST: SEND FULL FILE
      // ============================================
      res.setHeader('Content-Length', fileSize);
      
      // Stream entire file using streaming (memory efficient)
      const stream = createReadStream(filePath);
      stream.pipe(res);
    }

    // Handle stream errors
    res.on('error', (err) => {
      console.log('❌ Response error:', err);
    });
    
  } catch (err: any) {
    console.log('❌ Error serving file:', err);
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  }
};