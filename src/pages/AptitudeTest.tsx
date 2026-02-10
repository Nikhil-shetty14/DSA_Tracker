import React, { useState, useEffect, useCallback, useRef } from 'react';
import { questions, type Question } from '../data/questions';
import { topics } from '../data/topics';
import { useQuizResults, type QuizResult } from '../hooks/useFirestore';
import {
    BrainCircuit,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    RotateCcw,
    ArrowLeft,
    Shuffle,
    Trophy,
    Zap,
    ChevronRight,
    Timer,
    Star,
} from 'lucide-react';
import { cn } from '../lib/utils';

type Screen = 'topics' | 'quiz' | 'results';

interface QuizState {
    topicId: string;
    topicName: string;
    questions: Question[];
    currentIndex: number;
    answers: (number | null)[];
    timeLeft: number;
    totalTime: number;
    startTime: number;
}

const SECONDS_PER_QUESTION = 60;

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getGrade(pct: number): { letter: string; color: string; label: string } {
    if (pct >= 90) return { letter: 'A+', color: 'text-emerald-400', label: 'Outstanding!' };
    if (pct >= 80) return { letter: 'A', color: 'text-green-400', label: 'Excellent!' };
    if (pct >= 70) return { letter: 'B', color: 'text-blue-400', label: 'Great Job!' };
    if (pct >= 60) return { letter: 'C', color: 'text-yellow-400', label: 'Good Effort!' };
    if (pct >= 50) return { letter: 'D', color: 'text-orange-400', label: 'Keep Practicing!' };
    return { letter: 'F', color: 'text-red-400', label: 'Needs Improvement' };
}

const AptitudeTest: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('topics');
    const [quizState, setQuizState] = useState<QuizState | null>(null);
    const [quizResults, setQuizResults] = useQuizResults();
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ---------- Timer ----------
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (screen !== 'quiz' || !quizState) return;

        clearTimer();
        timerRef.current = setInterval(() => {
            setQuizState(prev => {
                if (!prev) return prev;
                if (prev.timeLeft <= 1) {
                    // Auto-advance or finish
                    if (prev.currentIndex < prev.questions.length - 1) {
                        return {
                            ...prev,
                            currentIndex: prev.currentIndex + 1,
                            timeLeft: SECONDS_PER_QUESTION,
                        };
                    } else {
                        // Time expired on last question — finish
                        setTimeout(() => finishQuiz(), 0);
                        return { ...prev, timeLeft: 0 };
                    }
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            });
        }, 1000);

        return clearTimer;
    }, [screen, quizState?.currentIndex]);

    // ---------- Actions ----------
    const startQuiz = (topicId: string, topicName: string) => {
        const pool = topicId === 'random'
            ? shuffleArray(questions).slice(0, 10)
            : shuffleArray(questions.filter(q => q.topicId === topicId)).slice(0, 5);

        const state: QuizState = {
            topicId,
            topicName,
            questions: pool,
            currentIndex: 0,
            answers: new Array(pool.length).fill(null),
            timeLeft: SECONDS_PER_QUESTION,
            totalTime: pool.length * SECONDS_PER_QUESTION,
            startTime: Date.now(),
        };
        setQuizState(state);
        setScreen('quiz');
    };

    const selectAnswer = (optionIndex: number) => {
        setQuizState(prev => {
            if (!prev) return prev;
            const answers = [...prev.answers];
            answers[prev.currentIndex] = optionIndex;
            return { ...prev, answers };
        });
    };

    const nextQuestion = () => {
        setQuizState(prev => {
            if (!prev) return prev;
            if (prev.currentIndex < prev.questions.length - 1) {
                return { ...prev, currentIndex: prev.currentIndex + 1, timeLeft: SECONDS_PER_QUESTION };
            }
            return prev;
        });
    };

    const finishQuiz = () => {
        clearTimer();
        if (!quizState) return;

        const score = quizState.questions.reduce((acc, q, i) => {
            return acc + (quizState.answers[i] === q.correctAnswer ? 1 : 0);
        }, 0);

        const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);

        const result: QuizResult = {
            topicId: quizState.topicId,
            score,
            total: quizState.questions.length,
            date: new Date().toISOString(),
            timeTaken,
        };

        setQuizResults(prev => [result, ...prev]);
        setScreen('results');
    };

    const goToTopics = () => {
        clearTimer();
        setScreen('topics');
        setQuizState(null);
    };

    const retryQuiz = () => {
        if (!quizState) return;
        startQuiz(quizState.topicId, quizState.topicName);
    };

    // ---------- Helpers ----------
    const getBestScore = (topicId: string): number | null => {
        const topicResults = quizResults.filter(r => r.topicId === topicId);
        if (topicResults.length === 0) return null;
        return Math.max(...topicResults.map(r => Math.round((r.score / r.total) * 100)));
    };

    // ---------- Render: Topic Selection ----------
    const renderTopicSelection = () => {
        const topicCards = topics.map(topic => {
            const count = questions.filter(q => q.topicId === topic.id).length;
            const best = getBestScore(topic.id);
            return (
                <button
                    key={topic.id}
                    onClick={() => startQuiz(topic.id, topic.name)}
                    className="group bg-card border border-border rounded-xl p-5 text-left hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {topic.name}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{count} Questions</span>
                        {best !== null && (
                            <span className={cn(
                                "flex items-center gap-1 font-medium",
                                best >= 80 ? 'text-emerald-500' : best >= 50 ? 'text-yellow-500' : 'text-red-400'
                            )}>
                                <Star className="w-3.5 h-3.5" /> Best: {best}%
                            </span>
                        )}
                    </div>
                </button>
            );
        });

        const randomBest = getBestScore('random');

        return (
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                        <BrainCircuit className="w-9 h-9 text-cyan-500" />
                        Test Yourself
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Take topic-wise quizzes to evaluate your DSA knowledge.
                    </p>
                </div>

                {/* Random Mix Card */}
                <button
                    onClick={() => startQuiz('random', 'Random Mix')}
                    className="w-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 border border-purple-500/30 rounded-2xl p-6 text-left hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                            <Shuffle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-xl text-foreground group-hover:text-purple-400 transition-colors">
                                Random Mix
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                10 random questions from all topics
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {randomBest !== null && (
                                <span className={cn(
                                    "text-sm font-medium flex items-center gap-1",
                                    randomBest >= 80 ? 'text-emerald-500' : randomBest >= 50 ? 'text-yellow-500' : 'text-red-400'
                                )}>
                                    <Star className="w-3.5 h-3.5" /> Best: {randomBest}%
                                </span>
                            )}
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </button>

                {/* Topic Grid */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Pick a Topic
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topicCards}
                    </div>
                </div>

                {/* Past Results Summary */}
                {quizResults.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Recent Attempts
                        </h2>
                        <div className="space-y-2">
                            {quizResults.slice(0, 5).map((r, i) => {
                                const pct = Math.round((r.score / r.total) * 100);
                                const topicName = r.topicId === 'random'
                                    ? 'Random Mix'
                                    : topics.find(t => t.id === r.topicId)?.name ?? r.topicId;
                                return (
                                    <div key={i} className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3">
                                        <div>
                                            <span className="font-medium">{topicName}</span>
                                            <span className="text-muted-foreground text-sm ml-3">
                                                {new Date(r.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "font-bold",
                                            pct >= 80 ? 'text-emerald-500' : pct >= 50 ? 'text-yellow-500' : 'text-red-400'
                                        )}>
                                            {r.score}/{r.total} ({pct}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // ---------- Render: Quiz ----------
    const renderQuiz = () => {
        if (!quizState) return null;
        const { questions: qs, currentIndex, answers, timeLeft } = quizState;
        const q = qs[currentIndex];
        const selected = answers[currentIndex];
        const progress = ((currentIndex + 1) / qs.length) * 100;
        const isLast = currentIndex === qs.length - 1;
        const timerPct = (timeLeft / SECONDS_PER_QUESTION) * 100;

        return (
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header Bar */}
                <div className="flex items-center justify-between">
                    <button onClick={goToTopics} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <span className="text-sm font-medium text-muted-foreground">
                        {quizState.topicName}
                    </span>
                    <div className={cn(
                        "flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-full",
                        timeLeft <= 10 ? 'bg-red-500/15 text-red-400 animate-pulse' : 'bg-card border border-border text-foreground'
                    )}>
                        <Timer className="w-4 h-4" />
                        {timeLeft}s
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Question {currentIndex + 1} of {qs.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {/* Timer bar */}
                    <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000 ease-linear",
                                timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 30 ? 'bg-yellow-500' : 'bg-emerald-500'
                            )}
                            style={{ width: `${timerPct}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-snug mb-8">
                        {q.question}
                    </h2>

                    <div className="space-y-3">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => selectAnswer(i)}
                                className={cn(
                                    "w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium",
                                    selected === i
                                        ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/10"
                                        : "border-border hover:border-primary/40 hover:bg-accent/50 text-foreground"
                                )}
                            >
                                <span className="inline-flex items-center gap-3">
                                    <span className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                                        selected === i
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-muted-foreground"
                                    )}>
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                    {isLast ? (
                        <button
                            onClick={finishQuiz}
                            disabled={selected === null}
                            className={cn(
                                "px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200",
                                selected !== null
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/20"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            disabled={selected === null}
                            className={cn(
                                "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200",
                                selected !== null
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/20"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // ---------- Render: Results ----------
    const renderResults = () => {
        if (!quizState) return null;
        const { questions: qs, answers } = quizState;
        const score = qs.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0);
        const pct = Math.round((score / qs.length) * 100);
        const grade = getGrade(pct);
        const latestResult = quizResults[0];
        const timeTaken = latestResult?.timeTaken ?? 0;
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;

        return (
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Score Card */}
                <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                    <h2 className="text-lg font-medium text-muted-foreground">
                        {quizState.topicName} — Results
                    </h2>
                    <div className={cn("text-7xl font-black", grade.color)}>
                        {grade.letter}
                    </div>
                    <p className="text-xl font-semibold text-foreground">{grade.label}</p>

                    <div className="flex items-center justify-center gap-8 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span><strong className="text-foreground">{score}</strong> <span className="text-muted-foreground">Correct</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <span><strong className="text-foreground">{qs.length - score}</strong> <span className="text-muted-foreground">Wrong</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <span className="text-muted-foreground">
                                {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
                            </span>
                        </div>
                    </div>

                    {/* Score bar */}
                    <div className="max-w-xs mx-auto mt-2">
                        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                )}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{pct}%</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={retryQuiz}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                    >
                        <RotateCcw className="w-4 h-4" /> Retry
                    </button>
                    <button
                        onClick={goToTopics}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> All Topics
                    </button>
                </div>

                {/* Question Breakdown */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Question Breakdown</h3>
                    <div className="space-y-4">
                        {qs.map((q, i) => {
                            const userAnswer = answers[i];
                            const isCorrect = userAnswer === q.correctAnswer;

                            return (
                                <div key={q.id} className={cn(
                                    "bg-card border rounded-xl p-5 space-y-3",
                                    isCorrect ? 'border-emerald-500/30' : 'border-red-500/30'
                                )}>
                                    <div className="flex items-start gap-3">
                                        {isCorrect
                                            ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                            : <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />}
                                        <p className="font-medium text-foreground">{q.question}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                                        {q.options.map((opt, j) => (
                                            <div
                                                key={j}
                                                className={cn(
                                                    "px-3 py-2 rounded-lg text-sm border",
                                                    j === q.correctAnswer
                                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-medium'
                                                        : j === userAnswer && !isCorrect
                                                            ? 'bg-red-500/10 border-red-500/30 text-red-400 line-through'
                                                            : 'border-border text-muted-foreground'
                                                )}
                                            >
                                                {String.fromCharCode(65 + j)}. {opt}
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-sm text-muted-foreground ml-8 bg-secondary/50 rounded-lg px-3 py-2">
                                        💡 {q.explanation}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // ---------- Main Render ----------
    return (
        <div>
            {screen === 'topics' && renderTopicSelection()}
            {screen === 'quiz' && renderQuiz()}
            {screen === 'results' && renderResults()}
        </div>
    );
};

export default AptitudeTest;
