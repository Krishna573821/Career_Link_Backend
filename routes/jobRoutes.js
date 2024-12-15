import express from 'express';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';
import { postJob, getJobs, getMyJobs, deleteJob, getJobById } from '../controllers/jobController.js';

const router = express.Router();

router.post('/post', isAuthenticated, isAuthorized("Employer"), postJob);
router.get('/getall', getJobs);
router.get('/getmyjobs', isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.delete('/delete/:id', isAuthenticated, isAuthorized("Employer"), deleteJob);
router.get('/get/:id',isAuthenticated, getJobById);


export default router;