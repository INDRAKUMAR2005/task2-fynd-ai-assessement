import { useState, useEffect } from 'react';
import {
    MessageSquare,
    Star,
    RefreshCcw,
    LayoutDashboard,
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
    const [isMounted, setIsMounted] = useState(false);

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
        setIsMounted(true);
        fetchFeedbacks();
        const interval = setInterval(() => fetchFeedbacks(), 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, []);

    if (!isMounted) return null;

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

                {/* Feedback List */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden mb-10">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]">
                        <h2 className="text-xl font-bold text-white">Live Submissions</h2>
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
                                                {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ''}
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
