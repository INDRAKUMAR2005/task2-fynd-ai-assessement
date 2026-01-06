'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    MessageSquare,
    Star,
    RefreshCcw,
    LayoutDashboard,
    ChevronRight,
    TrendingUp,
    Filter
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Feedback {
    _id: string;
    rating: number;
    review: string;
    aiResponse: string;
    aiSummary: string;
    aiActions: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFeedbacks = async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        try {
            const res = await fetch('/api/feedback');
            const result = await res.json();
            if (result.success) {
                setFeedbacks(result.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
        const interval = setInterval(() => fetchFeedbacks(), 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, []);

    const ratingCounts = feedbacks.reduce((acc: any, f) => {
        acc[f.rating] = (acc[f.rating] || 0) + 1;
        return acc;
    }, {});

    const avgRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {/* Sidebar (Desktop) */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0f172a] border-r border-slate-800 p-6 hidden lg:block">
                <div className="flex items-center gap-2 mb-10">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <LayoutDashboard className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Admin<span className="text-blue-500">Lens</span></span>
                </div>

                <nav className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium border border-blue-600/20">
                        <LayoutDashboard size={18} />
                        Overview
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
                        <BarChart3 size={18} />
                        Analytics
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-xl font-medium transition-colors">
                        <MessageSquare size={18} />
                        Reviews
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Feedback Overview</h1>
                        <p className="text-slate-400">Manage and analyze customer feedback with AI insights.</p>
                    </div>
                    <button
                        onClick={() => fetchFeedbacks(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1e293b] hover:bg-[#334155] rounded-xl border border-slate-700 transition-all font-medium"
                    >
                        <RefreshCcw className={cn("text-slate-400", refreshing && "animate-spin")} size={18} />
                        {refreshing ? 'Updating...' : 'Refresh Feed'}
                    </button>
                </header>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500">
                                <MessageSquare size={20} />
                            </div>
                            <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Total Reviews</h3>
                        <p className="text-3xl font-bold text-white mt-1">{feedbacks.length}</p>
                    </div>

                    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                                <Star size={20} />
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Avg. Rating</h3>
                        <p className="text-3xl font-bold text-white mt-1">{avgRating} <span className="text-lg text-slate-500">/ 5</span></p>
                    </div>

                    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 md:col-span-2">
                        <h3 className="text-slate-400 text-sm font-medium mb-4">Rating Distribution</h3>
                        <div className="flex items-end gap-3 h-16">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const height = feedbacks.length > 0
                                    ? ((ratingCounts[star] || 0) / feedbacks.length) * 100
                                    : 0;
                                return (
                                    <div key={star} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-blue-600/80 rounded-t-md transition-all duration-500 min-h-[4px]"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-[10px] text-slate-600 font-bold">{star}★</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden mb-10">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]">
                        <h2 className="text-xl font-bold text-white">Live Submissions</h2>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <RefreshCcw className="animate-spin text-blue-500" size={32} />
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="p-20 text-center text-slate-500">
                            No feedback submissions yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {feedbacks.map((f) => (
                                <div key={f._id} className="p-6 hover:bg-slate-800/30 transition-colors">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                        <div className="lg:col-span-2">
                                            <div className="flex items-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={14}
                                                        className={s <= f.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-700"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">
                                                {new Date(f.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="lg:col-span-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">User Review</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed italic">
                                                {f.review ? `"${f.review}"` : "No written review provided."}
                                            </p>
                                        </div>

                                        <div className="lg:col-span-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500/80 mb-2">AI Summary</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                {f.aiSummary}
                                            </p>
                                        </div>

                                        <div className="lg:col-span-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-green-500/80 mb-2">Recommended Actions</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                {f.aiActions}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
