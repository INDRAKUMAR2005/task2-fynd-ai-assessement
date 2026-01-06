const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
    const genAI = new GoogleGenerativeAI('AIzaSyCX3jp99dBSNKge8pk1Fh62CltS0rSiKr8');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = 'Say hello and return a valid JSON object with a "message" field: {"message": "Hello World"}';

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('AI Response:', response.text());
    } catch (error) {
        console.error('AI Error:', error.message);
    }
}

testAI();
