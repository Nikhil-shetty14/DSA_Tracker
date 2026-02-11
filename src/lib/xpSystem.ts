// XP & Leveling System Configuration

export interface LevelInfo {
    level: number;
    title: string;
    emoji: string;
    minXP: number;
    color: string;        // gradient classes
    badgeColor: string;   // for badge display
}

export const LEVELS: LevelInfo[] = [
    { level: 1, title: 'Beginner', emoji: '🌱', minXP: 0, color: 'from-gray-400 to-gray-500', badgeColor: 'text-gray-400' },
    { level: 2, title: 'Learner', emoji: '📗', minXP: 100, color: 'from-green-400 to-emerald-500', badgeColor: 'text-green-400' },
    { level: 3, title: 'Intermediate', emoji: '📘', minXP: 300, color: 'from-blue-400 to-cyan-500', badgeColor: 'text-blue-400' },
    { level: 4, title: 'Advanced', emoji: '🔥', minXP: 600, color: 'from-orange-400 to-red-500', badgeColor: 'text-orange-400' },
    { level: 5, title: 'Expert', emoji: '⚡', minXP: 1000, color: 'from-purple-400 to-indigo-500', badgeColor: 'text-purple-400' },
    { level: 6, title: 'Master', emoji: '🏆', minXP: 1500, color: 'from-yellow-400 to-amber-500', badgeColor: 'text-yellow-400' },
    { level: 7, title: 'Legend', emoji: '👑', minXP: 2500, color: 'from-yellow-300 to-yellow-600', badgeColor: 'text-yellow-300' },
];

// XP Rewards
export const XP_REWARDS = {
    SOLVE_PROBLEM: 10,
    QUIZ_COMPLETE: 20,
    QUIZ_CORRECT_ANSWER: 5,
    JOURNAL_ENTRY: 5,
    DAILY_STREAK: 15,
} as const;

/**
 * Get the current level info based on total XP
 */
export function calculateLevel(totalXP: number): LevelInfo {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVELS[i].minXP) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

/**
 * Get XP progress toward next level
 */
export function getLevelProgress(totalXP: number): {
    currentLevel: LevelInfo;
    nextLevel: LevelInfo | null;
    xpInCurrentLevel: number;
    xpForNextLevel: number;
    progressPercent: number;
} {
    const currentLevel = calculateLevel(totalXP);
    const currentIdx = LEVELS.findIndex(l => l.level === currentLevel.level);
    const nextLevel = currentIdx < LEVELS.length - 1 ? LEVELS[currentIdx + 1] : null;

    if (!nextLevel) {
        return {
            currentLevel,
            nextLevel: null,
            xpInCurrentLevel: totalXP - currentLevel.minXP,
            xpForNextLevel: 0,
            progressPercent: 100,
        };
    }

    const xpInCurrentLevel = totalXP - currentLevel.minXP;
    const xpForNextLevel = nextLevel.minXP - currentLevel.minXP;
    const progressPercent = Math.round((xpInCurrentLevel / xpForNextLevel) * 100);

    return {
        currentLevel,
        nextLevel,
        xpInCurrentLevel,
        xpForNextLevel,
        progressPercent: Math.min(progressPercent, 100),
    };
}

/**
 * Get streak multiplier for XP bonus
 * - Days 1-6: 1x
 * - Days 7-13: 1.5x
 * - Days 14-29: 2x
 * - Days 30+: 3x
 */
export function getStreakMultiplier(currentStreak: number): number {
    if (currentStreak >= 30) return 3;
    if (currentStreak >= 14) return 2;
    if (currentStreak >= 7) return 1.5;
    return 1;
}

/**
 * Calculate XP earned from a daily streak
 */
export function getStreakXP(currentStreak: number): number {
    return Math.round(XP_REWARDS.DAILY_STREAK * getStreakMultiplier(currentStreak));
}

/**
 * Calculate XP earned from completing a quiz
 */
export function getQuizXP(correctAnswers: number): number {
    return XP_REWARDS.QUIZ_COMPLETE + (correctAnswers * XP_REWARDS.QUIZ_CORRECT_ANSWER);
}

/**
 * Check if adding XP causes a level up
 */
export function checkLevelUp(currentXP: number, xpToAdd: number): {
    leveledUp: boolean;
    oldLevel: LevelInfo;
    newLevel: LevelInfo;
} {
    const oldLevel = calculateLevel(currentXP);
    const newLevel = calculateLevel(currentXP + xpToAdd);
    return {
        leveledUp: newLevel.level > oldLevel.level,
        oldLevel,
        newLevel,
    };
}
