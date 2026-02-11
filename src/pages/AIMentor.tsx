import React, { useState, useRef, useEffect, useCallback } from 'react';
import { topics } from '../data/topics';
import { useProgress, useQuizResults } from '../hooks/useFirestore';
import { mentorProblems, type MentorProblem } from '../data/mentorProblems';
import {
    getApiKey,
    setApiKey as saveApiKey,
    removeApiKey,
    validateApiKey,
    getDailySuggestions,
    generatePracticeSet,
    getHint,
    chatWithMentor,
} from '../lib/gemini';
import {
    Bot,
    Send,
    Key,
    Sparkles,
    Lightbulb,
    BookOpen,
    Target,
    Zap,
    Loader2,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    CheckCircle2,
    Trash2,
    RefreshCw,
    MessageSquare,
    GraduationCap,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const AIMentor: React.FC = () => {
    // API Key state
    const [apiKey, setApiKeyState] = useState<string | null>(getApiKey());
    const [keyInput, setKeyInput] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [keyError, setKeyError] = useState('');

    // Chat state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Daily suggestions state
    const [suggestions, setSuggestions] = useState<string>('');
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);

    // Practice set state
    const [selectedTopic, setSelectedTopic] = useState(topics[0]?.id || '');
    const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

    // Problem hint state
    const [selectedProblem, setSelectedProblem] = useState<MentorProblem | null>(null);
    const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);

    // Data hooks
    const [progress] = useProgress();
    const [quizResults] = useQuizResults();

    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    // === API KEY HANDLERS ===
    const handleSaveKey = async () => {
        if (!keyInput.trim()) return;
        setIsValidating(true);
        setKeyError('');
        try {
            const valid = await validateApiKey(keyInput.trim());
            if (valid) {
                saveApiKey(keyInput.trim());
                setApiKeyState(keyInput.trim());
                setKeyInput('');
            } else {
                setKeyError('Invalid API key. Please check and try again.');
            }
        } catch {
            setKeyError('Failed to validate key. Check your internet connection.');
        }
        setIsValidating(false);
    };

    const handleRemoveKey = () => {
        removeApiKey();
        setApiKeyState(null);
        setMessages([]);
        setSuggestions('');
    };

    // === CHAT HANDLERS ===
    const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            role,
            content,
            timestamp: new Date(),
        }]);
    }, []);

    const handleSend = async () => {
        const msg = inputMessage.trim();
        if (!msg || isLoading) return;

        addMessage('user', msg);
        setInputMessage('');
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
        setIsLoading(true);

        try {
            const response = await chatWithMentor(msg, messages.map(m => ({
                role: m.role,
                content: m.content,
            })));
            addMessage('assistant', response);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
            if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
                addMessage('assistant', `⏳ **Rate limit reached!** The Gemini free tier has a limit of ~15 requests/minute.\n\nPlease **wait 1-2 minutes** and try again. Your API key is fine — this is just a temporary cooldown. ☕`);
            } else {
                addMessage('assistant', `⚠️ Error: ${errorMsg}. Please try again.`);
            }
        }
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // === FEATURE HANDLERS ===
    const handleDailySuggestions = async () => {
        setIsSuggestionsLoading(true);
        try {
            const result = await getDailySuggestions(progress, quizResults, topics);
            setSuggestions(result);
            setSuggestionsExpanded(true);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to get suggestions';
            setSuggestions(`⚠️ Error: ${errorMsg}`);
        }
        setIsSuggestionsLoading(false);
    };

    const handleExplainMistake = async () => {
        if (quizResults.length === 0) {
            addMessage('assistant', "📝 You haven't taken any quizzes yet! Head to **Test Yourself** to take a quiz first, then I can help explain any mistakes.");
            return;
        }
        setIsLoading(true);
        addMessage('user', '🔍 Explain my recent mistakes from quizzes');
        try {
            const recentResults = quizResults.slice(0, 3);
            const summaries = recentResults.map(r => {
                const topicName = topics.find(t => t.id === r.topicId)?.name || r.topicId;
                const pct = Math.round((r.score / r.total) * 100);
                return `${topicName}: scored ${r.score}/${r.total} (${pct}%)`;
            });

            const response = await chatWithMentor(
                `Analyze my recent quiz results and give me targeted advice on what I need to improve. Here are my recent scores:\n${summaries.join('\n')}\n\nWhat concepts should I focus on and what are common mistakes for these topics?`,
                []
            );
            addMessage('assistant', response);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
            addMessage('assistant', `⚠️ Error: ${errorMsg}`);
        }
        setIsLoading(false);
    };

    const handlePracticeSet = async () => {
        const topicName = topics.find(t => t.id === selectedTopic)?.name || selectedTopic;
        setIsLoading(true);
        addMessage('user', `📋 Generate a ${selectedDifficulty} practice set for ${topicName}`);
        try {
            const result = await generatePracticeSet(topicName, selectedDifficulty);
            addMessage('assistant', result);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
            addMessage('assistant', `⚠️ Error: ${errorMsg}`);
        }
        setIsLoading(false);
    };

    const handleGetHint = async () => {
        if (!selectedProblem) return;
        setIsLoading(true);
        addMessage('user', `💡 Give me a Level ${hintLevel} hint for "${selectedProblem.name}" (${selectedProblem.topic})`);
        try {
            const result = await getHint(
                `${selectedProblem.name} - ${selectedProblem.keyConcept} (${selectedProblem.difficulty})`,
                hintLevel
            );
            addMessage('assistant', result);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
            addMessage('assistant', `⚠️ Error: ${errorMsg}`);
        }
        setIsLoading(false);
    };

    // === RENDER: API KEY SETUP ===
    if (!apiKey) {
        return (
            <div className="max-w-lg mx-auto mt-12 space-y-6">
                <div className="text-center space-y-3">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                        <Bot className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        AI DSA Mentor
                    </h1>
                    <p className="text-muted-foreground">
                        Your personal AI coach for mastering Data Structures & Algorithms
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Key className="w-5 h-5 text-yellow-500" />
                        Setup API Key
                    </div>
                    <p className="text-sm text-muted-foreground">
                        To use the AI Mentor, you need a free Google Gemini API key.
                        Get one from{' '}
                        <a
                            href="https://aistudio.google.com/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-500 hover:text-cyan-400 underline inline-flex items-center gap-1"
                        >
                            Google AI Studio <ExternalLink className="w-3 h-3" />
                        </a>
                    </p>

                    <div className="space-y-3">
                        <input
                            type="password"
                            value={keyInput}
                            onChange={e => setKeyInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
                            placeholder="Paste your Gemini API key here..."
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:ring-2 focus:ring-cyan-500/50 outline-none text-sm"
                        />

                        {keyError && (
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {keyError}
                            </div>
                        )}

                        <button
                            onClick={handleSaveKey}
                            disabled={!keyInput.trim() || isValidating}
                            className={cn(
                                "w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2",
                                keyInput.trim() && !isValidating
                                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg hover:shadow-cyan-500/20"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            {isValidating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Validating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Connect & Start
                                </>
                            )}
                        </button>
                    </div>

                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-medium text-cyan-400">✨ What you'll get:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Daily problem suggestions based on your weak areas</li>
                            <li>• Mistake explanations after quizzes</li>
                            <li>• Custom practice sets by topic & difficulty</li>
                            <li>• Step-by-step hints (not full solutions)</li>
                            <li>• Free-form DSA Q&A chat</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // === RENDER: MAIN MENTOR PAGE ===
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                        <Bot className="w-8 h-8 text-cyan-400" />
                        AI DSA Mentor
                    </h1>
                    <p className="text-muted-foreground">Your personal coach for DSA mastery</p>
                </div>
                <button
                    onClick={handleRemoveKey}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-red-400/30"
                    title="Remove API Key"
                >
                    <Key className="w-3.5 h-3.5" />
                    Change Key
                </button>
            </div>

            {/* Daily Suggestions Panel */}
            <div className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20 rounded-2xl overflow-hidden">
                <button
                    onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-cyan-500/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                            <Target className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h2 className="font-semibold">Today's Practice Plan</h2>
                            <p className="text-xs text-muted-foreground">AI-curated problems for your weak areas</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!suggestions && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDailySuggestions(); }}
                                disabled={isSuggestionsLoading}
                                className="px-4 py-1.5 text-sm rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
                            >
                                {isSuggestionsLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                )}
                                Generate
                            </button>
                        )}
                        {suggestions && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDailySuggestions(); }}
                                disabled={isSuggestionsLoading}
                                className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-muted-foreground hover:text-cyan-400 transition-colors"
                                title="Refresh suggestions"
                            >
                                {isSuggestionsLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                            </button>
                        )}
                        {suggestionsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </div>
                </button>

                {suggestionsExpanded && suggestions && (
                    <div className="px-4 pb-4 border-t border-cyan-500/10">
                        <div className="mt-3 prose prose-sm dark:prose-invert max-w-none text-sm">
                            <MarkdownRenderer content={suggestions} />
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Explain Mistakes */}
                <button
                    onClick={handleExplainMistake}
                    disabled={isLoading}
                    className="group bg-card border border-border rounded-xl p-4 text-left hover:border-red-400/40 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-sm">Explain My Mistakes</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">Analyze your recent quiz results and learn from errors</p>
                </button>

                {/* Practice Set Generator */}
                <div className="bg-card border border-border rounded-xl p-4 hover:border-green-400/40 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-sm">Practice Set</h3>
                    </div>
                    <div className="flex gap-2 mb-2">
                        <select
                            value={selectedTopic}
                            onChange={e => setSelectedTopic(e.target.value)}
                            className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-background border border-input outline-none"
                        >
                            {topics.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedDifficulty}
                            onChange={e => setSelectedDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                            className="text-xs px-2 py-1.5 rounded-lg bg-background border border-input outline-none"
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <button
                        onClick={handlePracticeSet}
                        disabled={isLoading}
                        className="w-full py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-1"
                    >
                        <Zap className="w-3 h-3" /> Generate Set
                    </button>
                </div>

                {/* Get Hint */}
                <div className="bg-card border border-border rounded-xl p-4 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-500/5 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                            <Lightbulb className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-sm">Get a Hint</h3>
                    </div>
                    <div className="space-y-2">
                        <select
                            value={selectedProblem?.id || ''}
                            onChange={e => setSelectedProblem(mentorProblems.find(p => p.id === e.target.value) || null)}
                            className="w-full text-xs px-2 py-1.5 rounded-lg bg-background border border-input outline-none"
                        >
                            <option value="">Select a problem...</option>
                            {mentorProblems.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.difficulty})
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-1">
                            {([1, 2, 3] as const).map(level => (
                                <button
                                    key={level}
                                    onClick={() => setHintLevel(level)}
                                    className={cn(
                                        "flex-1 py-1 text-xs rounded-lg transition-colors font-medium",
                                        hintLevel === level
                                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                            : "bg-background border border-input text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    L{level}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleGetHint}
                            disabled={isLoading || !selectedProblem}
                            className={cn(
                                "w-full py-1.5 text-xs rounded-lg transition-colors flex items-center justify-center gap-1",
                                selectedProblem && !isLoading
                                    ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            <Lightbulb className="w-3 h-3" /> Get Hint
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <span className="font-medium text-sm">Chat with your Mentor</span>
                    </div>
                    {messages.length > 0 && (
                        <button
                            onClick={() => setMessages([])}
                            className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" /> Clear
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '500px' }}>
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                                <GraduationCap className="w-10 h-10 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Hey! I'm your DSA Mentor 👋</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                    Ask me anything about DSA — concepts, problem approaches, time complexity, or use the quick actions above!
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 pt-2">
                                {[
                                    "What's the difference between BFS and DFS?",
                                    "When should I use dynamic programming?",
                                    "Explain two-pointer technique",
                                ].map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setInputMessage(q); }}
                                        className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-3",
                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 text-white shrink-0 h-fit mt-1">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-br-md"
                                        : "bg-secondary/70 border border-border rounded-bl-md"
                                )}
                            >
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                        <MarkdownRenderer content={msg.content} />
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 text-white shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-secondary/70 border border-border rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Thinking...
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-3 bg-background/50">
                    <div className="flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask your DSA mentor anything..."
                            rows={1}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 border border-input focus:ring-2 focus:ring-cyan-500/50 outline-none resize-none text-sm"
                            style={{ maxHeight: '120px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputMessage.trim() || isLoading}
                            className={cn(
                                "p-2.5 rounded-xl transition-all duration-200 shrink-0",
                                inputMessage.trim() && !isLoading
                                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/20"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SIMPLE MARKDOWN RENDERER ===
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderMarkdown = (text: string): React.ReactNode[] => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeLines: string[] = [];

        let listItems: string[] = [];
        let listType: 'ul' | 'ol' | null = null;

        const flushList = () => {
            if (listItems.length > 0 && listType) {
                const Tag = listType;
                elements.push(
                    <Tag key={`list-${elements.length}`} className={listType === 'ol' ? 'list-decimal list-inside space-y-1' : 'list-disc list-inside space-y-1'}>
                        {listItems.map((item, i) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                        ))}
                    </Tag>
                );
                listItems = [];
                listType = null;
            }
        };

        const formatInline = (line: string): string => {
            return line
                .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono">$1</code>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Code block toggle
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    flushList();
                    inCodeBlock = true;
                    void line.slice(3).trim(); // language identifier (unused)
                    codeLines = [];
                } else {
                    elements.push(
                        <pre key={`code-${elements.length}`} className="bg-background rounded-xl p-4 overflow-x-auto border border-border my-2">
                            <code className="text-xs font-mono text-foreground">{codeLines.join('\n')}</code>
                        </pre>
                    );
                    inCodeBlock = false;
                }
                continue;
            }

            if (inCodeBlock) {
                codeLines.push(line);
                continue;
            }

            // Headings
            if (line.startsWith('### ')) {
                flushList();
                elements.push(<h4 key={`h-${i}`} className="font-bold text-base mt-3 mb-1" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(4)) }} />);
                continue;
            }
            if (line.startsWith('## ')) {
                flushList();
                elements.push(<h3 key={`h-${i}`} className="font-bold text-lg mt-3 mb-1" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(3)) }} />);
                continue;
            }
            if (line.startsWith('# ')) {
                flushList();
                elements.push(<h2 key={`h-${i}`} className="font-bold text-xl mt-3 mb-1" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />);
                continue;
            }

            // Unordered list
            if (/^[\-\*•]\s/.test(line)) {
                if (listType !== 'ul') {
                    flushList();
                    listType = 'ul';
                }
                listItems.push(line.replace(/^[\-\*•]\s/, ''));
                continue;
            }

            // Ordered list
            if (/^\d+\.\s/.test(line)) {
                if (listType !== 'ol') {
                    flushList();
                    listType = 'ol';
                }
                listItems.push(line.replace(/^\d+\.\s/, ''));
                continue;
            }

            // Empty line
            if (line.trim() === '') {
                flushList();
                continue;
            }

            // Normal paragraph
            flushList();
            elements.push(
                <p key={`p-${i}`} className="my-1" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
            );
        }

        flushList();
        return elements;
    };

    return <>{renderMarkdown(content)}</>;
};

export default AIMentor;
