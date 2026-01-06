const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI('AIzaSyCX3jp99dBSNKge8pk1Fh62CltS0rSiKr8');
    try {
        // There isn't a direct listModels in the SDK for client-side usually, 
        // but we can check if it's available or try a standard model version.
        // Actually, the error message said "Call ListModels".

        // Let's try to just hit a very standard one with v1 explicitly if possible, 
        // or just try common variants one more time with error logging.

        const variants = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
        for (const v of variants) {
            try {
                const model = genAI.getGenerativeModel({ model: v });
                const result = await model.generateContent('Hi');
                console.log(`Success with ${v}:`, result.response.text());
                return;
            } catch (e) {
                console.log(`Failed with ${v}:`, e.message);
            }
        }
    } catch (error) {
        console.error('List Error:', error.message);
    }
}

listModels();
