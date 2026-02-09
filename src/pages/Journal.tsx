import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

interface JournalEntry {
    id: string;
    date: string;
    problemsCount: number;
    learned: string;
    reflection: string;
}

const Journal: React.FC = () => {
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>('dsa-journal', []);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [problemsCount, setProblemsCount] = useState('');
    const [learned, setLearned] = useState('');
    const [reflection, setReflection] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: JournalEntry = {
            id: crypto.randomUUID(),
            date: new Date().toLocaleDateString(),
            problemsCount: parseInt(problemsCount) || 0,
            learned,
            reflection
        };

        setEntries([newEntry, ...entries]);
        setShowForm(false);
        setProblemsCount('');
        setLearned('');
        setReflection('');
    };

    const deleteEntry = (id: string) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Learning Journal</h1>
                    <p className="text-muted-foreground mt-2">Reflect on your daily progress and mistakes.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    {showForm ? 'Cancel' : 'Add Entry'}
                    {!showForm && <Plus className="w-4 h-4" />}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-xl space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Problems Solved</label>
                            <input
                                type="number"
                                min="0"
                                value={problemsCount}
                                onChange={(e) => setProblemsCount(e.target.value)}
                                className="w-full p-2 rounded-md bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">What I learned today</label>
                        <textarea
                            value={learned}
                            onChange={(e) => setLearned(e.target.value)}
                            className="w-full p-2 h-24 rounded-md bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            placeholder="Concepts, algorithms, or tricks..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Reflections / Mistakes</label>
                        <textarea
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            className="w-full p-2 h-24 rounded-md bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            placeholder="What went wrong? How can I improve?"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Save Entry
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {entries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No journal entries yet. Start writing today!</p>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                                        {entry.date}
                                    </span>
                                    <h3 className="font-semibold text-lg mt-2">Solved {entry.problemsCount} Problems</h3>
                                </div>
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-primary mb-1">Key Learnings</h4>
                                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{entry.learned}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-orange-500 mb-1">Reflections</h4>
                                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{entry.reflection || "No reflections recorded."}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Journal;
