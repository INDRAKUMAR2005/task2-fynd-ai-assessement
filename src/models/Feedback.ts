import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    rating: number;
    review: string;
    aiResponse: string;
    aiSummary: string;
    aiActions: string;
    createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: false },
    aiResponse: { type: String, required: true },
    aiSummary: { type: String, required: true },
    aiActions: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
