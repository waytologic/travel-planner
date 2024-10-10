import { Schema, model } from 'mongoose';
import mongoose, { Document } from 'mongoose';

export interface ICustomer {
    username: string;
    email: string;
    destination: string;
}

export interface ICustomerModel extends ICustomer, Document {}


const travelSchema = new Schema({
    email: {type: String,required: true},  
    username: {type: String,required: true},
    destination: { type: String, required: true },
    date: { type: Date, required: true },
    phone: {type: String,required: true},    
    statusCode:{type: Number},
    notes: { type: String },
    __v: { type: Number, select: false},
});

const Travel = model('Travel', travelSchema);


export default Travel;

