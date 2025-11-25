import { Request, Response } from 'express';
import path from 'path';
import { createReadStream, existsSync, statSync } from 'fs';

const BASE = path.resolve('public/videos');

export const serveHlsSegments = (req: Request, res: Response) => {
  // videoId and fileName are set by the regex route handler in index.ts
  const videoId = req.params.videoId || '';
  const fileName = req.params.fileName || '';

  console.log('=== SEGMENT REQUEST ===');
  console.log('Full URL:', req.url);
  console.log('videoId:', videoId);
  console.log('fileName:', fileName);

  if (!videoId || !fileName) {
    console.log('no videoId or fileName');
    return res.status(400).send('Missing videoId or fileName');
  }

  const filePath = path.join(BASE, videoId, fileName);
  console.log('Resolved file path:', filePath);
  console.log('File exists?', existsSync(filePath));

  if (!filePath.startsWith(BASE)) {
    console.log('Path traversal attempt blocked');
    return res.status(403).send('Forbidden');
  }

  if (!existsSync(filePath)) {
    console.log('File not found:', filePath);
    return res.status(404).send('File not found');
  }

  try {
    const stat = statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // CONTENT-TYPE OBLIGATORIO
    if (fileName.endsWith('.ts')) {
      res.setHeader('Content-Type', 'video/mp2t');
    } else if (fileName.endsWith('.m3u8')) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    }

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Handle Range requests (used by video players for seeking)
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send('Requested Range Not Satisfiable');
        return;
      }

      const chunksize = end - start + 1;
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunksize);

      const stream = createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      const stream = createReadStream(filePath);
      stream.pipe(res);
    }

    res.on('error', (err) => {
      console.log('Response error:', err);
    });
  } catch (err: any) {
    console.log('Error serving file:', err);
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  }
};