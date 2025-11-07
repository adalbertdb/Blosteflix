import express from 'express';
import iVideoRepository from './infraestructure/repositories/iVideoRepository.js';
import { createUserRouter } from './presentation/routes/router.js';
import { videoController } from "./infraestructure/controller/videoController.js";
import { getById } from "./application/use-cases/getById.js";
import { getByTopic } from "./application/use-cases/getByTopic.js";
import { getVideolist } from "./application/use-cases/getVideolist.js";
// express app
const app = express();
app.use(express.json());
// build dependencies
const repo = new iVideoRepository();
const getByIdUC = new getById(repo);
const getByTopicUC = new getByTopic(repo);
const getVideolistUC = new getVideolist(repo);
const controller = new videoController(getByIdUC, getByTopicUC, getVideolistUC);
// mount router
app.use('/api/videolist', createUserRouter(controller));
// Start
const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server is running on port ${port}`); });
//# sourceMappingURL=index.js.map