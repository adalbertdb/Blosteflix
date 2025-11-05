import express from 'express';
import iVideoRepository from "./infraestructure/repositories/iVideoRepository";
import VideoRepository from "./domain/repositories/videoRepository.js";
import router from './presentation/routes/router.js'

const app = express();
app.use(express.json());

const domainRepo = new iVideoRepository();
const infraRepo = new VideoRepository(domainRepo);
const videoRoutes = new router(infraRepo);
app.use('/api/videolist',videoRoutes);



const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server is running on port ${port}`);})