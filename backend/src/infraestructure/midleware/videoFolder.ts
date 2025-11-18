// src/middlewares/serveDynamicFolder.middleware.ts
import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';

export const serveDynamicFolder = (baseFolder: string = 'public/videos') =>
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { id } = req.params;

            const folderPath = path.resolve(baseFolder, id);

            // Verificar que esté dentro del directorio permitido (defensa en profundidad)
            if (!folderPath.startsWith(path.resolve(baseFolder))) {
                return res.status(400).json({ error: 'Acceso no permitido' });
            }

            const stats = await fs.stat(folderPath);
            if (!stats.isDirectory()) {
                return res.status(404).json({ error: 'Carpeta no encontrada' });
            }

            // Servir estáticamente solo esta carpeta
            express.static(folderPath, {
                index: 'index.m3u8',
                dotfiles: 'deny',
                fallthrough: false,
                etag: true,
                maxAge: '1h',
            })(req, res, next);

        } catch (err: any) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ error: 'Carpeta no encontrada' });
            }
            next(err);
        }
    };