import mongoose, { Document, Schema } from 'mongoose';

export interface ITrips {
    destination: string;
    startDate: Date;
    endDate: Date;
    notes: string;
}

export interface ITrip extends ITrips, Document {}

const TripSchema: Schema = new Schema({
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    notes: { type: String },
    },
    {
     timestamps: true
    }
);

// Middleware to format date when converting to JSON
TripSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.startDate = formatDate(ret.startDate);
        ret.endDate = formatDate(ret.endDate);
        return ret;
    },
});

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};


export default mongoose.model<ITrip>('Trip', TripSchema);
