import express from 'express';
import controller from '../controllers/TravelControl';
import { authenticateToken } from '../middleware/authendicateToken';

const router = express.Router();
router.get('/getplan',controller.travelController.getTravels)
router.post('/create', controller.travelController.createTravel);

export = router;
