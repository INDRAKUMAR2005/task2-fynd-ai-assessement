import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface FeedbackAnalysis {
    userResponse: string;
    summary: string;
    recommendedActions: string;
}

export async function analyzeFeedback(rating: number, review: string): Promise<FeedbackAnalysis> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
    You are an AI assistant for a feedback system. 
    Analyze the following customer feedback:
    Rating: ${rating}/5
    Review: ${review || "No written review provided."}

    Provide the following in a structured JSON format:
    1. "userResponse": A personalized, conversational, and opinionated response to the user's feedback. 
       - If the feedback is positive, be enthusiastic and highlight specific praise.
       - If the feedback is negative, be genuinely empathetic, address their specific complaint, and offer assurance.
       - Avoid generic phrases like "Thank you for your feedback". Instead, use varied openings and different conversational styles based on the rating and review content. (2-3 sentences).
    2. "summary": A concise, one-sentence summary of the feedback for an administrator.
    3. "recommendedActions": suggested actions for the administrator based on this specific feedback (1 sentence).

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
        // Fallback with some basic variation based on rating
        const defaultResponses: Record<number, string> = {
            5: "We're absolutely thrilled you had a 5-star experience! Your kind words mean the world to our team.",
            4: "Thanks for the 4-star rating! We're glad you enjoyed it and we'll keep working to make it perfect.",
            3: "We appreciate your honest 3-star feedback. We're committed to improving and hope to win you over next time.",
            2: "I'm sorry to see you had a 2-star experience. We've noted your concerns and are looking into how to do better.",
            1: "I'm genuinely sorry for the 1-star experience. This isn't the standard we strive for, and we are prioritizing a fix based on your input."
        };
        return {
            userResponse: defaultResponses[rating] || "Thank you for sharing your thoughts with us.",
            summary: "User provided a " + rating + "-star rating with a " + (review ? "review" : "no review") + ".",
            recommendedActions: "Review feedback details and monitor for similar patterns."
        };
    }
}
