import React, { useState } from 'react';
import { quotes } from '../data/quotes';
import useLocalStorage from '../hooks/useLocalStorage';
import { useStreak } from '../hooks/useStreak';
import { Flame, Target, Edit2, Save } from 'lucide-react';
import Badges from '../components/Badges';

const Home: React.FC = () => {
    const [todaysQuote] = useState(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        return quotes[dayOfYear % quotes.length];
    });

    const [reason, setReason] = useLocalStorage<string>('dsa-reason', '');
    const [isEditingReason, setIsEditingReason] = useState(false);
    const [tempReason, setTempReason] = useState(reason);
    const { streak } = useStreak();

    const handleSaveReason = () => {
        setReason(tempReason);
        setIsEditingReason(false);
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <section className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Keep Grinding, Student!
                </h1>
                <p className="text-muted-foreground text-lg">
                    Consistency is the key to mastering Data Structures & Algorithms.
                </p>
            </section>

            {/* Quote Card */}
            <section className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-primary/20 p-8 rounded-2xl relative overflow-hidden group hover:border-primary/40 transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="w-32 h-32" />
                </div>
                <blockquote className="relative z-10 text-xl md:text-2xl font-medium italic text-foreground/90">
                    "{todaysQuote.text}"
                </blockquote>
                <cite className="block mt-4 text-sm font-semibold text-primary">
                    — {todaysQuote.author}
                </cite>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Why I Started Section */}
                <section className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-500" />
                            Why I Started DSA
                        </h2>
                        <button
                            onClick={() => isEditingReason ? handleSaveReason() : setIsEditingReason(true)}
                            className="text-primary hover:text-primary/80 transition-colors"
                        >
                            {isEditingReason ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                        </button>
                    </div>

                    {isEditingReason ? (
                        <textarea
                            value={tempReason}
                            onChange={(e) => setTempReason(e.target.value)}
                            className="w-full h-32 p-3 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            placeholder="I want to crack FAANG because..."
                        />
                    ) : (
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {reason || "Write down your 'Why' here. It will keep you going when things get tough."}
                        </p>
                    )}
                </section>

                {/* Quick Stats Summary */}
                <section className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        At a Glance
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background/50 p-4 rounded-lg border border-border/50">
                            <span className="text-sm text-muted-foreground block mb-1">Current Streak</span>
                            <span className="text-2xl font-bold text-orange-500">{streak.currentStreak} Days</span>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border border-border/50">
                            <span className="text-sm text-muted-foreground block mb-1">Best Streak</span>
                            <span className="text-2xl font-bold text-green-500">{streak.bestStreak} Days</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Badges Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                <Badges />
            </section>
        </div>
    );
};

export default Home;
