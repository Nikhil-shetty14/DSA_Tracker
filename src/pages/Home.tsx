import React, { useState } from 'react';
import { quotes } from '../data/quotes';
import useLocalStorage from '../hooks/useLocalStorage';
import { useFirestoreStreak, useXP } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import { Flame, Target, Edit2, Save, Sparkles } from 'lucide-react';
import Badges from '../components/Badges';
import { getLevelProgress, getStreakMultiplier } from '../lib/xpSystem';
import { cn } from '../lib/utils';

const Home: React.FC = () => {
    const [todaysQuote] = useState(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        return quotes[dayOfYear % quotes.length];
    });

    const [reason, setReason] = useLocalStorage<string>('dsa-reason', '');
    const [isEditingReason, setIsEditingReason] = useState(false);
    const [tempReason, setTempReason] = useState(reason);
    const { streak } = useFirestoreStreak();
    const { user } = useAuth();
    const { xpData } = useXP();
    const levelProgress = getLevelProgress(xpData.totalXP);
    const streakMultiplier = getStreakMultiplier(streak.currentStreak);

    const handleSaveReason = () => {
        setReason(tempReason);
        setIsEditingReason(false);
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <section className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Keep Grinding, {user?.email ? user.email.split('@')[0].split(/[._-]/)[0].charAt(0).toUpperCase() + user.email.split('@')[0].split(/[._-]/)[0].slice(1).toLowerCase() : 'Champ'}!
                </h1>
                <p className="text-muted-foreground text-lg">
                    Consistency is the key to mastering Data Structures & Algorithms.
                </p>
            </section>

            {/* Level & XP Section */}
            <section className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center sm:text-left">
                        <div className="text-5xl mb-1">{levelProgress.currentLevel.emoji}</div>
                        <div className="text-xs text-muted-foreground">Level {levelProgress.currentLevel.level}</div>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">{levelProgress.currentLevel.title}</h3>
                            <div className="flex items-center gap-1.5 text-sm">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span className="font-semibold text-yellow-400">{xpData.totalXP} XP</span>
                            </div>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-1000 bg-gradient-to-r", levelProgress.currentLevel.color)}
                                style={{ width: `${levelProgress.progressPercent}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                {levelProgress.nextLevel
                                    ? `${levelProgress.xpInCurrentLevel} / ${levelProgress.xpForNextLevel} XP to ${levelProgress.nextLevel.emoji} ${levelProgress.nextLevel.title}`
                                    : '🎉 MAX LEVEL!'}
                            </span>
                            {streakMultiplier > 1 && (
                                <span className="text-orange-400 font-medium">
                                    🔥 {streakMultiplier}x streak bonus
                                </span>
                            )}
                        </div>
                    </div>
                </div>
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
