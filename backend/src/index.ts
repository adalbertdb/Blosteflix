import express from 'express';
import iVideoRepository from './infraestructure/repositories/iVideoRepository.js';
import VideoRepository from './domain/repositories/videoRepository.js';
import router from './presentation/routes/router.js'

const app = express();
app.use(express.json());

const infraRepo: iVideoRepository = new iVideoRepository();
const videoRoutes : router= new router(infraRepo);

//TODO : Afegir router
// app.use('/api/videolist',);



const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server is running on port ${port}`);})