import { NextFunction, Request, Response } from 'express';
import Travel from '../models/travel';
import Trip  from '../models/Trip';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { BLACKLISTEDTOKENS, JWT_SECRET } from '../config/config';
import Logging from '../library/Logging';

const travelController = {  
  getTravels: async (req: Request, res: Response) => {
    try{
      console.log('Travel Planer started -');
      console.log('~~~~~~ ~~~~~~ ~~~~~~~ -');
      Logging.warn(`Get Travel information.`);
      const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];    
    const travels = await Travel.find();
    if (token) {
      BLACKLISTEDTOKENS.add(token);
      let result =  res.json(travels);
      res.json(travels);
      Logging.warn(result)
      res.status(200).json({ message: 'Load all Travel informaton' });
      }else {
        res.status(400).json({ message: 'No token has provided' });
        Logging.error('No token has provided')
      }
    } catch (err) {
      Logging.error(`"Internal Server Error`);  
      return res.status(500).json({ message: 'Internal Server Error' });          
    } 
  }, 
  getAllTrips: async (req: Request, res: Response) => {
    try{
      console.log('Travel Planer started -');
      console.log('~~~~~~ ~~~~~~ ~~~~~~~ -');
      Logging.warn(`Get Travel information.`);
      const trips = await Trip.find();   
      let result =  res.json(trips);
      res.json(trips);
      Logging.warn(result)
      res.status(200).json({ message: 'Load all Travel informaton' });     
      if(res.status(400)){
        res.status(400).json({ message: 'No token has provided' });
        Logging.error('No token has provided')
      } 
    } catch (err) {
      Logging.error(`"Internal Server Error`);  
      return res.status(500).json({ message: 'Internal Server Error' });          
    } 
  }, 
  createTravel:async (req: Request, res: Response) => {
    try{
      const travel = new Travel(req.body);
      await travel.save();
      res.status(201).json(travel);
      Logging.warn(`Trave details Saved Successfully!!!.`);
    }
    catch (err) {
      Logging.error(`"Internal Server Error`);  
      return res.status(500).json({ message: 'Internal Server Error' });          
    }  
  },
  // createTrip:async (req: Request, res: Response) => {
  //   const trips = new Trip(req.body);
    
  //   try {
  //     const savedTrip = await trips.save();
  //     res.status(201).json(savedTrip);
  //   } catch (error:any) {
  //       res.status(400).json({ message: error.message });
  //   }    

  // },
  updateTrip: async (req: Request, res: Response) => {
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTrip);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
},
  updateTravel:async (req: Request, res: Response) => {
    try{
      
    } 
    catch (err) {
    Logging.error(`"Internal Server Error`);  
    return res.status(500).json({ message: 'Internal Server Error' });     

    }  
  },
 
};

// Validation functions
export const isValidUserName = (username: string) => {
  if (username.length < 3) {
    return 'Username must have minimum 3 characters';
  }
  if (username.length > 32) {
    return 'Username must have maximum 32 characters';
  }
  return null;
};

export const isValidEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

export const isValidPassword = (password: string) => {
  // Password validation criteria:
  // - At least 8 characters long
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one number
  // - At least one special character
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
};

export const isValidPhoneNumber = (phoneNumber: string) => {
  // Phone number validation pattern:
  const indianMobilePattern = /^((\+91)?[\s-]?)?[6789]\d{9}$/;
  return indianMobilePattern.test(phoneNumber);
};

export default { travelController };
