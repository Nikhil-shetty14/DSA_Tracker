import React from 'react';
import { useStreak } from '../hooks/useStreak';
import { Star, Zap, Flame } from 'lucide-react';
import { cn } from '../lib/utils';

const Badges: React.FC = () => {
    const { streak } = useStreak();
    // Mock total solved for now, in real app would come from context
    const totalSolved = 0;

    const badges = [
        {
            id: 'streak-7',
            label: '7 Day Streak',
            icon: Zap,
            unlocked: streak.bestStreak >= 7,
            color: 'text-yellow-500 bg-yellow-500/10'
        },
        {
            id: 'streak-30',
            label: '30 Day Streak',
            icon: Flame,
            unlocked: streak.bestStreak >= 30,
            color: 'text-orange-500 bg-orange-500/10'
        },
        {
            id: 'solved-100',
            label: '100 Problems',
            icon: Star,
            unlocked: totalSolved >= 100,
            color: 'text-blue-500 bg-blue-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                    <div
                        key={badge.id}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border border-border transition-all",
                            badge.unlocked ? badge.color : "opacity-50 grayscale bg-secondary"
                        )}
                    >
                        <Icon className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium text-center">{badge.label}</span>
                    </div>
                )
            })}
        </div>
    );
};

export default Badges;
