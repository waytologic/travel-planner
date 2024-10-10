import { Router } from 'express';
import { getAllTrips, createTrip, updateTrip, deleteTrip } from '../controllers/tripController';

const router = Router();

router.get('/getallplan', getAllTrips);
router.post('/trips', createTrip);
router.put('/trips/:id', updateTrip);
router.delete('/trips/:id', deleteTrip);

export default router;