import { Request, Response } from 'express';
import Trip, { ITrip } from '../models/Trip';
import Logging from '../library/Logging';

// Get all trips
export const getAllTrips = async (req: Request, res: Response) => {
    try {
        const trips = await Trip.find();
        console.log('Travel Planer started -');
        console.log('~~~~~~ ~~~~~~ ~~~~~~~ -');
        Logging.warn(`Get Travel information.`);
        res.json(trips);
    } catch (error:any) {
        res.status(500).json({ message: error.message });
        Logging.error(`"Internal Server Error`);  
    }
};

// Create a new trip
export const createTrip = async (req: Request, res: Response) => {
    const trip: ITrip = new Trip(req.body);
    try {
        const savedTrip = await trip.save();
        res.status(201).json(savedTrip);
        Logging.warn(`Trip plan succesffully created!`);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

// Update a trip
export const updateTrip = async (req: Request, res: Response) => {
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTrip);
        Logging.warn(`Trip plan succesffully updated !`);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a trip
export const deleteTrip = async (req: Request, res: Response) => {
    try {
        await Trip.findByIdAndDelete(req.params.id);
        res.status(204).send();
        console.log("Trip deleted !! ");                
        Logging.warn(`Trip plan succesffully deleted!`);
    } catch (error:any) {
        let errmsg;
        res.status(500).json({ message: error.message });
        errmsg = res.status(500).json({ message: error.message });
        Logging.error(errmsg);  
    }
};