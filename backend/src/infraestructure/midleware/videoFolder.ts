// src/middlewares/serveHlsIndex.middleware.ts
import type { Request, Response } from 'express';
import path from 'path';
import { promises as fs } from 'fs';

const BASE_FOLDER = 'public/videos';

export const serveHlsIndex = async (req: Request, res: Response) => {
    const { videoId } = req.params;
  try {
    if (!videoId) return res.status(400).send('ID requerido');

    const filePath = path.resolve(BASE_FOLDER, videoId, 'index.m3u8');

    // Seguridad anti path-traversal
    if (!filePath.startsWith(path.resolve(BASE_FOLDER))) {
      return res.status(403).send('Forbidden');
    }

    let content = await fs.readFile(filePath, 'utf-8');

    // Reescribir las rutas relativas en el .m3u8
    // Convertir "index0.ts" en "/api/videolist/videos/{videoId}/index0.ts"
    content = content.replace(
      /^(index\d+\.ts)$/gm,
      `/api/videolist/videos/${videoId}/$1`
    );

    // También para otros posibles .m3u8 anidados si existen
    content = content.replace(
      /^([\w-]+\.m3u8)$/gm,
      `/api/videolist/videos/${videoId}/$1`
    );

    console.log('Serving playlist for:', videoId); // Debug log

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Length', Buffer.byteLength(content, 'utf-8'));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');

    return res.send(content);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.error('Video not found:', videoId);
      return res.status(404).send('Vídeo no encontrado');
    }
    console.error('Error sirviendo index.m3u8:', err);
    return res.status(500).send('Error interno');
  }
};