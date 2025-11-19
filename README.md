# 🎬 Proyecto de Streaming — Implementación Inicial

## 🧠 Descripción general
Este proyecto forma parte de una aplicación tipo **Netflix / YouTube**, compuesta por un **backend** desarrollado en **Node.js + Express + TypeScript** y un **frontend móvil** en **Flutter**.  
Ambos siguen una **arquitectura CLEAN**, separando la lógica de negocio, dominio e infraestructura.

---

## 🧩 Backend
El servidor gestiona la información de los vídeos disponibles mediante un fichero localizado en la capa de **infraestructura**.

Cada vídeo contiene los siguientes campos:

| Campo        | Tipo     | Descripción                            |
|---------------|----------|----------------------------------------|
| `id`          | String   | Identificador del vídeo (nombre del archivo). |
| `topic`       | String   | Temática o categoría del vídeo.        |
| `description` | String   | Breve descripción del contenido.       |
| `duration`    | Double   | Duración en segundos.                  |
| `thumbnail`   | String   | Imagen o miniatura representativa.    |

---

## 🌐 API REST
La API expone los siguientes **endpoints** bajo la ruta base `/api/videolist`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/videolist/` | Devuelve la lista de vídeos con `id`, `topic`, `duration` y `thumbnail`. |
| `GET` | `/api/videolist/:topic` | Devuelve todos los vídeos de la temática seleccionada. |
| `GET` | `/api/videolist/:id` | Devuelve la información completa del vídeo indicado. |

---

## 📱 Aplicación móvil (Frontend)
El reproductor móvil, desarrollado en **Flutter**, consume la API anterior para mostrar los vídeos.

- La pantalla principal muestra una **lista** con los vídeos y su información básica.  
- Al pulsar sobre un vídeo, se muestra **su información completa** en un widget superior.  
- Toda la estructura sigue los principios de **arquitectura CLEAN** (presentation, domain, infrastructure).

---

## 🧰 Tecnologías principales
- **Backend:** Node.js, Express, TypeScript  
- **Frontend:** Flutter  
- **Arquitectura:** CLEAN Architecture  

---

## 🚀 Estado actual
✅ Implementación inicial del backend  
🚧 Desarrollo del frontend en curso  
🧪 Próximos pasos: integración completa entre API y app

---
