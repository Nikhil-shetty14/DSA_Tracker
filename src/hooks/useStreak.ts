import useLocalStorage from './useLocalStorage';

interface StreakData {
    currentStreak: number;
    lastLogDate: string | null;
    bestStreak: number;
}

export function useStreak() {
    const [streak, setStreak] = useLocalStorage<StreakData>('dsa-streak', {
        currentStreak: 0,
        lastLogDate: null,
        bestStreak: 0
    });



    const updateStreak = () => {
        const today = new Date().toLocaleDateString();
        const lastLog = streak.lastLogDate;

        if (lastLog === today) return; // Already updated for today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString();

        let newCurrentStreak = 1;
        if (lastLog === yesterdayStr) {
            newCurrentStreak = streak.currentStreak + 1;
        }

        setStreak({
            currentStreak: newCurrentStreak,
            lastLogDate: today,
            bestStreak: Math.max(newCurrentStreak, streak.bestStreak)
        });
    };

    return { streak, updateStreak };
}
