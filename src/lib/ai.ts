import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface FeedbackAnalysis {
    userResponse: string;
    summary: string;
    recommendedActions: string;
}

export async function analyzeFeedback(rating: number, review: string): Promise<FeedbackAnalysis> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
    You are an AI assistant for a feedback system. 
    Analyze the following customer feedback:
    Rating: ${rating}/5
    Review: ${review || "No written review provided."}

    Provide the following in a structured JSON format:
    1. "userResponse": A polite, conversational response to the user's feedback (1-2 sentences).
    2. "summary": A concise summary of the feedback for an administrator (1 sentence).
    3. "recommendedActions": suggested actions for the administrator based on this feedback (1 sentence).

    Ensure your response is valid JSON.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Attempt to parse JSON from the text block
        const cleanedText = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            userResponse: "Thank you for your feedback! We've received your submission.",
            summary: "User provided a " + rating + "-star rating with a " + (review ? "review" : "no review") + ".",
            recommendedActions: "Monitor for similar feedback patterns."
        };
    }
}
