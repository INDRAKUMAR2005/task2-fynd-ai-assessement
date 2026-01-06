import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';
import { analyzeFeedback } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const { rating, review } = await req.json();

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Valid rating (1-5) is required.' }, { status: 400 });
        }

        await dbConnect();

        // Call AI analysis
        const analysis = await analyzeFeedback(rating, review);

        const newFeedback = new Feedback({
            rating,
            review,
            aiResponse: analysis.userResponse,
            aiSummary: analysis.summary,
            aiActions: analysis.recommendedActions,
        });

        await newFeedback.save();

        return NextResponse.json({
            success: true,
            data: {
                aiResponse: analysis.userResponse
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: feedbacks });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
