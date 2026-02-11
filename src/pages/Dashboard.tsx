import React, { useState } from 'react';
import { topics, type Topic } from '../data/topics';
import { useProgress, useFirestoreStreak, useXP } from '../hooks/useFirestore';
import { BarChart2, Plus, Minus, Flame, Trophy, Target, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { XP_REWARDS, getLevelProgress, getStreakXP } from '../lib/xpSystem';

const Dashboard: React.FC = () => {
    const [progress, setProgress] = useProgress();
    const { streak, updateStreak } = useFirestoreStreak();
    const { xpData, addXP } = useXP();
    const [totalGoals] = useState<{ [key: string]: number }>({});
    const [xpAnimation, setXpAnimation] = useState<{ amount: number; key: number } | null>(null);

    const levelProgress = getLevelProgress(xpData.totalXP);

    const showXPGain = (amount: number) => {
        setXpAnimation({ amount, key: Date.now() });
        setTimeout(() => setXpAnimation(null), 1500);
    };

    const updateProgress = (topicId: string, delta: number) => {
        setProgress(prev => {
            const current = prev[topicId] || 0;
            const newValue = Math.max(0, current + delta);
            return { ...prev, [topicId]: newValue };
        });

        // Update streak when adding a problem
        if (delta > 0) {
            updateStreak();
            // Award XP for solving a problem
            addXP(XP_REWARDS.SOLVE_PROBLEM);
            showXPGain(XP_REWARDS.SOLVE_PROBLEM);
            // Award streak XP if it's a new day
            const today = new Date().toLocaleDateString();
            if (streak.lastLogDate !== today) {
                const streakXP = getStreakXP(streak.currentStreak + 1);
                setTimeout(() => {
                    addXP(streakXP);
                    showXPGain(streakXP);
                }, 800);
            }
        }
    };

    const getTopicGoal = (topic: Topic) => totalGoals[topic.id] || topic.defaultTotal;

    // Calculate total stats
    const totalSolved = Object.values(progress).reduce((sum, val) => sum + val, 0);
    const totalProblems = topics.reduce((sum, topic) => sum + getTopicGoal(topic), 0);
    const overallPercentage = Math.round((totalSolved / totalProblems) * 100) || 0;

    // Get top 6 topics for chart
    const chartData = topics
        .map(topic => ({
            name: topic.name.length > 12 ? topic.name.substring(0, 10) + '...' : topic.name,
            solved: progress[topic.id] || 0,
            total: getTopicGoal(topic),
            percentage: Math.round(((progress[topic.id] || 0) / getTopicGoal(topic)) * 100)
        }))
        .sort((a, b) => b.solved - a.solved)
        .slice(0, 6);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Progress Dashboard</h1>
                <p className="text-muted-foreground mt-2">Track your problem-solving journey across different topics.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* XP & Level Card */}
                <div className="relative bg-gradient-to-br from-indigo-500/10 to-violet-600/10 border border-indigo-500/20 p-4 rounded-xl overflow-hidden">
                    {xpAnimation && (
                        <div
                            key={xpAnimation.key}
                            className="absolute top-2 right-3 text-sm font-bold text-green-400 animate-bounce"
                        >
                            +{xpAnimation.amount} XP
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-indigo-500 mb-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium">Level {levelProgress.currentLevel.level}</span>
                    </div>
                    <div className="text-xl font-bold flex items-center gap-1.5">
                        <span>{levelProgress.currentLevel.emoji}</span>
                        <span className="text-lg">{levelProgress.currentLevel.title}</span>
                    </div>
                    <div className="mt-2">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-700 bg-gradient-to-r", levelProgress.currentLevel.color)}
                                style={{ width: `${levelProgress.progressPercent}%` }}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {xpData.totalXP} XP{levelProgress.nextLevel ? ` / ${levelProgress.nextLevel.minXP} XP` : ' — MAX!'}
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                        <Target className="w-5 h-5" />
                        <span className="text-sm font-medium">Total Solved</span>
                    </div>
                    <div className="text-3xl font-bold">{totalSolved}</div>
                    <div className="text-xs text-muted-foreground">of {totalProblems} problems</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <Flame className="w-5 h-5" />
                        <span className="text-sm font-medium">Current Streak</span>
                    </div>
                    <div className="text-3xl font-bold">{streak.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">days in a row</div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                        <Trophy className="w-5 h-5" />
                        <span className="text-sm font-medium">Best Streak</span>
                    </div>
                    <div className="text-3xl font-bold">{streak.bestStreak}</div>
                    <div className="text-xs text-muted-foreground">personal best</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-purple-500 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm font-medium">Overall Progress</span>
                    </div>
                    <div className="text-3xl font-bold">{overallPercentage}%</div>
                    <div className="text-xs text-muted-foreground">completion rate</div>
                </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="bg-card border border-border p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    Topic Progress Chart
                </h2>
                <div className="space-y-4">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-24 text-sm text-muted-foreground truncate">{item.name}</div>
                            <div className="flex-1 h-8 bg-secondary rounded-lg overflow-hidden relative">
                                <div
                                    className={cn(
                                        "h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-2",
                                        item.percentage >= 100 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                                            item.percentage >= 75 ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                                                item.percentage >= 50 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                                                    "bg-gradient-to-r from-red-500 to-pink-500"
                                    )}
                                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                                >
                                    <span className="text-xs font-bold text-white drop-shadow">{item.solved}</span>
                                </div>
                            </div>
                            <div className="w-12 text-sm text-right text-muted-foreground">{item.percentage}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Topic Cards Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4">All Topics</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {topics.map((topic) => {
                        const solved = progress[topic.id] || 0;
                        const total = getTopicGoal(topic);
                        const percentage = Math.min(100, Math.round((solved / total) * 100));

                        return (
                            <div key={topic.id} className="bg-card border border-border p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{topic.name}</h3>
                                        <div className="text-sm text-muted-foreground flex gap-2">
                                            <span>{solved} / {total} Solved</span>
                                            <span>•</span>
                                            <span className={cn(
                                                "font-medium",
                                                percentage >= 75 ? "text-green-500" :
                                                    percentage >= 40 ? "text-yellow-500" : "text-red-500"
                                            )}>{percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-secondary rounded-lg">
                                        <BarChart2 className="w-5 h-5 text-primary" />
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-4">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500 ease-out",
                                            percentage >= 100 ? "bg-green-500" : "bg-primary"
                                        )}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => updateProgress(topic.id, -1)}
                                        disabled={solved <= 0}
                                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => updateProgress(topic.id, 1)}
                                        className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
