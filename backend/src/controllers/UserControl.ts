import { NextFunction, Request, Response } from 'express';
import User from '../models/UserModel';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { BLACKLISTEDTOKENS, JWT_SECRET } from '../config/config';

const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, phone } = req.body;
      if (!username || !email || !password || !phone) {
        return res.status(400).json({ message: 'Please check input data' });
      }
      const validationErrors = [
        isValidUserName(username),
        !isValidEmail(email) && 'Please enter a valid email address.',
        !isValidPassword(password) && 'Please enter a valid password.',
        !isValidPhoneNumber(phone) && 'Please enter a valid phone number.'
      ].filter(Boolean);
      if (validationErrors.length > 0) {
        return res.status(400).json({ message: validationErrors.join(', ') });
      }
      const [emailExists, usernameExists] = await Promise.all([User.findOne({ username }).exec(), User.findOne({ email }).exec()]);

      if (emailExists) return res.status(401).json({ message: 'Email Already Exists' });
      if (usernameExists) return res.status(401).json({ message: 'Username Already Exists' });

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password,
        phone
      });
      await user.save();
      return res.status(201).json({ user });
    } catch (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Please check input data' });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
      }

      const isMatch = password === user.password;
      if (!isMatch) {
        return res.status(400).json({ message: "Password doesn't match" });
      }
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successfully', token, username: user.username });
    } catch (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      BLACKLISTEDTOKENS.add(token);
      res.status(200).json({ message: 'Logged out successfully' });
    } else {
      res.status(400).json({ message: 'No token provided' });
    }
  },
  // GET all users
  getusers: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const users = await User.find();
    
    if (token) {
      BLACKLISTEDTOKENS.add(token);
      res.json(users);
      res.status(200).json({ message: 'Load all users informaton' });
    } else {
      res.status(400).json({ message: 'No token provided' });
    }
  },
  userbyid: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];    
    const user = await User.findById(req.params.id);
    
    if (token) {
      BLACKLISTEDTOKENS.add(token);
      if (user) {
        res.json(user);
      }
      else {
        res.status(404).json({ message: 'User not found' });
      }     
      res.status(200).json({ message: 'Current '+ user +' loaded Sucessfully ' });
    } else {
      res.status(400).json({ message: 'No token provided' });
    }
  }
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

export default { userController };
