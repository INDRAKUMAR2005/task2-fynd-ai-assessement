'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [aiResponse, setAiResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review }),
      });

      const result = await res.json();
      if (result.success) {
        setAiResponse(result.data.aiResponse);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setRating(0);
    setReview('');
    setStatus('idle');
    setAiResponse('');
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <h1 className="text-2xl font-bold text-white">Share Your Feedback</h1>
          <p className="text-blue-100 mt-1">We value your opinion and use AI to listen better.</p>
        </div>

        <div className="p-8">
          {status === 'idle' || status === 'loading' || status === 'error' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">How would you rate your experience?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform active:scale-95 duration-200"
                    >
                      <Star
                        size={32}
                        className={cn(
                          "transition-colors duration-200",
                          (hoveredRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-600"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Write a short review (optional)</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  <AlertCircle size={18} />
                  <span className="text-sm">Something went wrong. Please try again.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={rating === 0 || status === 'loading'}
                className={cn(
                  "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                  rating === 0 || status === 'loading'
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                )}
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="bg-green-500/10 p-4 rounded-full border border-green-500/20">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Thank You!</h2>
                <div className="bg-[#0f172a] border-l-4 border-blue-500 p-4 rounded-r-xl text-left italic text-slate-300">
                  "{aiResponse}"
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
              >
                Submit another review
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
