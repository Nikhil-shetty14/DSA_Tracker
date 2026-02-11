import React from 'react';
import { useProgress, useFirestoreStreak, useJournal, useXP } from '../hooks/useFirestore';
import {
    Trophy, Star, Zap, Flame, Target, BookOpen,
    Medal, Crown, Sparkles, Rocket, Award, Heart,
    CheckCircle, TrendingUp, Clock, Coffee
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LEVELS, calculateLevel } from '../lib/xpSystem';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    condition: boolean;
    progress: number;
    maxProgress: number;
    color: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const BadgesPage: React.FC = () => {
    const [progress] = useProgress();
    const { streak } = useFirestoreStreak();
    const [journal] = useJournal();
    const { xpData } = useXP();
    const currentLevel = calculateLevel(xpData.totalXP);

    const totalSolved = Object.values(progress).reduce((sum, val) => sum + val, 0);

    const badges: Badge[] = [
        // Problem Solving Badges
        {
            id: 'first-blood',
            name: 'First Blood',
            description: 'Solve your first problem',
            icon: Star,
            condition: totalSolved >= 1,
            progress: Math.min(totalSolved, 1),
            maxProgress: 1,
            color: 'from-yellow-400 to-orange-500',
            rarity: 'common'
        },
        {
            id: 'beginner',
            name: 'Beginner',
            description: 'Solve 10 problems',
            icon: Target,
            condition: totalSolved >= 10,
            progress: Math.min(totalSolved, 10),
            maxProgress: 10,
            color: 'from-green-400 to-emerald-500',
            rarity: 'common'
        },
        {
            id: 'rising-star',
            name: 'Rising Star',
            description: 'Solve 25 problems',
            icon: Sparkles,
            condition: totalSolved >= 25,
            progress: Math.min(totalSolved, 25),
            maxProgress: 25,
            color: 'from-blue-400 to-cyan-500',
            rarity: 'common'
        },
        {
            id: 'problem-solver',
            name: 'Problem Solver',
            description: 'Solve 50 problems',
            icon: CheckCircle,
            condition: totalSolved >= 50,
            progress: Math.min(totalSolved, 50),
            maxProgress: 50,
            color: 'from-purple-400 to-pink-500',
            rarity: 'rare'
        },
        {
            id: 'centurion',
            name: 'Centurion',
            description: 'Solve 100 problems',
            icon: Medal,
            condition: totalSolved >= 100,
            progress: Math.min(totalSolved, 100),
            maxProgress: 100,
            color: 'from-indigo-400 to-purple-500',
            rarity: 'rare'
        },
        {
            id: 'grinder',
            name: 'Grinder',
            description: 'Solve 250 problems',
            icon: Rocket,
            condition: totalSolved >= 250,
            progress: Math.min(totalSolved, 250),
            maxProgress: 250,
            color: 'from-orange-400 to-red-500',
            rarity: 'epic'
        },
        {
            id: 'dsa-master',
            name: 'DSA Master',
            description: 'Solve 500 problems',
            icon: Crown,
            condition: totalSolved >= 500,
            progress: Math.min(totalSolved, 500),
            maxProgress: 500,
            color: 'from-yellow-400 to-amber-600',
            rarity: 'legendary'
        },

        // Streak Badges
        {
            id: 'streak-3',
            name: 'Getting Started',
            description: '3 day streak',
            icon: Zap,
            condition: streak.bestStreak >= 3,
            progress: Math.min(streak.bestStreak, 3),
            maxProgress: 3,
            color: 'from-yellow-400 to-orange-400',
            rarity: 'common'
        },
        {
            id: 'streak-7',
            name: 'Week Warrior',
            description: '7 day streak',
            icon: Flame,
            condition: streak.bestStreak >= 7,
            progress: Math.min(streak.bestStreak, 7),
            maxProgress: 7,
            color: 'from-orange-400 to-red-500',
            rarity: 'common'
        },
        {
            id: 'streak-14',
            name: 'Dedicated',
            description: '14 day streak',
            icon: Heart,
            condition: streak.bestStreak >= 14,
            progress: Math.min(streak.bestStreak, 14),
            maxProgress: 14,
            color: 'from-pink-400 to-rose-500',
            rarity: 'rare'
        },
        {
            id: 'streak-30',
            name: 'Monthly Master',
            description: '30 day streak',
            icon: Trophy,
            condition: streak.bestStreak >= 30,
            progress: Math.min(streak.bestStreak, 30),
            maxProgress: 30,
            color: 'from-amber-400 to-yellow-600',
            rarity: 'epic'
        },
        {
            id: 'streak-100',
            name: 'Unstoppable',
            description: '100 day streak',
            icon: Award,
            condition: streak.bestStreak >= 100,
            progress: Math.min(streak.bestStreak, 100),
            maxProgress: 100,
            color: 'from-violet-400 to-purple-600',
            rarity: 'legendary'
        },

        // Journal Badges
        {
            id: 'journal-first',
            name: 'Journaler',
            description: 'Write your first journal entry',
            icon: BookOpen,
            condition: journal.length >= 1,
            progress: Math.min(journal.length, 1),
            maxProgress: 1,
            color: 'from-teal-400 to-cyan-500',
            rarity: 'common'
        },
        {
            id: 'journal-10',
            name: 'Reflective',
            description: 'Write 10 journal entries',
            icon: Coffee,
            condition: journal.length >= 10,
            progress: Math.min(journal.length, 10),
            maxProgress: 10,
            color: 'from-amber-400 to-orange-500',
            rarity: 'rare'
        },

        // Special Badges
        {
            id: 'early-bird',
            name: 'Early Bird',
            description: 'Start your DSA journey',
            icon: Clock,
            condition: true,
            progress: 1,
            maxProgress: 1,
            color: 'from-sky-400 to-blue-500',
            rarity: 'common'
        },
        {
            id: 'consistency',
            name: 'Consistent',
            description: 'Solve problems in 5 different topics',
            icon: TrendingUp,
            condition: Object.values(progress).filter(v => v > 0).length >= 5,
            progress: Math.min(Object.values(progress).filter(v => v > 0).length, 5),
            maxProgress: 5,
            color: 'from-emerald-400 to-green-500',
            rarity: 'rare'
        },

        // Level Milestones
        ...LEVELS.filter(l => l.level >= 2).map(l => ({
            id: `level-${l.level}`,
            name: `${l.emoji} ${l.title}`,
            description: `Reach Level ${l.level} (${l.minXP} XP)`,
            icon: l.level >= 6 ? Crown : l.level >= 4 ? Rocket : Star,
            condition: currentLevel.level >= l.level,
            progress: Math.min(xpData.totalXP, l.minXP),
            maxProgress: l.minXP,
            color: l.color,
            rarity: (l.level >= 6 ? 'legendary' : l.level >= 4 ? 'epic' : l.level >= 3 ? 'rare' : 'common') as Badge['rarity']
        }))
    ];

    const unlockedBadges = badges.filter(b => b.condition);
    const lockedBadges = badges.filter(b => !b.condition);

    const getRarityStyles = (rarity: Badge['rarity']) => {
        switch (rarity) {
            case 'common': return 'border-gray-400/30';
            case 'rare': return 'border-blue-400/50';
            case 'epic': return 'border-purple-400/50';
            case 'legendary': return 'border-yellow-400/50 shadow-lg shadow-yellow-500/20';
        }
    };

    const getRarityLabel = (rarity: Badge['rarity']) => {
        switch (rarity) {
            case 'common': return 'text-gray-400';
            case 'rare': return 'text-blue-400';
            case 'epic': return 'text-purple-400';
            case 'legendary': return 'text-yellow-400';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Achievements</h1>
                <p className="text-muted-foreground mt-2">
                    Unlock badges by solving problems, maintaining streaks, and staying consistent.
                </p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/20 p-4 rounded-xl text-center">
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{unlockedBadges.length}</div>
                    <div className="text-sm text-muted-foreground">Unlocked</div>
                </div>
                <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 p-4 rounded-xl text-center">
                    <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{lockedBadges.length}</div>
                    <div className="text-sm text-muted-foreground">Locked</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-4 rounded-xl text-center">
                    <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{totalSolved}</div>
                    <div className="text-sm text-muted-foreground">Problems Solved</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-4 rounded-xl text-center">
                    <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{streak.bestStreak}</div>
                    <div className="text-sm text-muted-foreground">Best Streak</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/10 to-violet-600/10 border border-indigo-500/20 p-4 rounded-xl text-center">
                    <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{xpData.totalXP}</div>
                    <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
            </div>

            {/* Unlocked Badges */}
            {unlockedBadges.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Unlocked Badges ({unlockedBadges.length})
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {unlockedBadges.map((badge) => {
                            const Icon = badge.icon;
                            return (
                                <div
                                    key={badge.id}
                                    className={cn(
                                        "bg-card border-2 p-4 rounded-xl transition-all hover:scale-105 cursor-pointer",
                                        getRarityStyles(badge.rarity)
                                    )}
                                >
                                    <div className={cn(
                                        "w-16 h-16 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center mb-3",
                                        badge.color
                                    )}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-center">{badge.name}</h3>
                                    <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
                                    <p className={cn("text-xs text-center mt-2 font-medium uppercase", getRarityLabel(badge.rarity))}>
                                        {badge.rarity}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                        <Target className="w-5 h-5" />
                        Locked Badges ({lockedBadges.length})
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {lockedBadges.map((badge) => {
                            const Icon = badge.icon;
                            const progressPercent = Math.round((badge.progress / badge.maxProgress) * 100);
                            return (
                                <div
                                    key={badge.id}
                                    className="bg-card border border-border p-4 rounded-xl opacity-60 grayscale hover:opacity-80 transition-all"
                                >
                                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-3">
                                        <Icon className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-center">{badge.name}</h3>
                                    <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>

                                    {/* Progress Bar */}
                                    <div className="mt-3">
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground mt-1">
                                            {badge.progress} / {badge.maxProgress}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BadgesPage;
