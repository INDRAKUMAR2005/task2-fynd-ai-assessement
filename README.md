# AI Feedback System (Two-Dashboard)

A production-style web application for collecting user feedback and analyzing it using AI.

## Features

- **User Dashboard**: 1-5 star rating and review submission with instant AI-generated response.
- **Admin Dashboard**: Live-updating feed of submissions with AI summaries and recommended actions.
- **AI-Powered**: Uses Google Gemini 1.5 Flash for analysis and response generation.
- **Responsive Design**: Built with Next.js, Tailwind CSS, and Lucide icons.

## Tech Stack

- **Frontend/Backend**: Next.js (App Router)
- **Database**: MongoDB (Mongoose)
- **AI**: Google Generative AI (Gemini API)
- **Deployment Target**: Vercel

## Local Setup

1. **Clone/Download** the repository.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   - User Dashboard: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin`

## Deployment (Vercel)

1. Connect your repository to Vercel.
2. Add the `MONGODB_URI` and `GEMINI_API_KEY` to the project's Environment Variables in the Vercel dashboard.
3. Vercel will automatically detect Next.js and deploy.

## Technical Details

- **Server-Side AI**: All Gemini API calls are made in Next.js Server Actions/API Routes to protect the API key.
- **Robustness**: Handles empty reviews and long reviews gracefully. Includes error states for API failures.
- **Schemas**: Uses Mongoose for explicit JSON schemas and data persistence.
