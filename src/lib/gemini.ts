import { GoogleGenerativeAI } from '@google/generative-ai';

// Retry wrapper for rate-limited requests
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            const isRateLimit = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Too Many Requests');
            if (isRateLimit && attempt < maxRetries - 1) {
                const delay = (attempt + 1) * 10000; // 10s, 20s, 30s
                console.warn(`Rate limited, retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            throw err;
        }
    }
    throw new Error('Max retries exceeded');
}

const STORAGE_KEY = 'gemini-api-key';

export function getApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEY, key);
}

export function removeApiKey(): void {
    localStorage.removeItem(STORAGE_KEY);
}

function getModel() {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('Gemini API key not set');

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: `You are an expert DSA (Data Structures & Algorithms) mentor and personal coach. Your role is to:
- Guide students through DSA concepts with patience and encouragement
- Never give full solutions directly — instead, provide progressive hints
- Use simple analogies and examples to explain complex concepts
- Format responses with markdown: use **bold**, code blocks, bullet points, and numbered lists
- Keep responses concise but thorough (under 300 words unless explaining a complex topic)
- When suggesting problems, mention the topic, difficulty, and key concept being tested
- Celebrate progress and encourage consistency
- If asked something outside DSA, politely redirect to DSA topics`
    });
}

export interface DailySuggestion {
    problemName: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    keyConcepte: string;
    whyThisProblem: string;
    leetcodeLink?: string;
}

export async function getDailySuggestions(
    progress: { [key: string]: number },
    quizResults: Array<{ topicId: string; score: number; total: number }>,
    topics: Array<{ id: string; name: string; defaultTotal: number }>
): Promise<string> {
    const model = getModel();

    const progressSummary = topics.map(t => {
        const solved = progress[t.id] || 0;
        const pct = Math.round((solved / t.defaultTotal) * 100);
        return `${t.name}: ${solved}/${t.defaultTotal} (${pct}%)`;
    }).join('\n');

    const recentQuizzes = quizResults.slice(0, 10).map(r => {
        const topicName = topics.find(t => t.id === r.topicId)?.name || r.topicId;
        const pct = Math.round((r.score / r.total) * 100);
        return `${topicName}: ${r.score}/${r.total} (${pct}%)`;
    }).join('\n');

    const prompt = `Based on this student's progress, suggest 3-5 specific LeetCode/DSA problems they should practice today. Focus on their WEAKEST areas.

**Progress:**
${progressSummary || 'No progress data yet'}

**Recent Quiz Scores:**
${recentQuizzes || 'No quizzes taken yet'}

For each problem, provide:
1. Problem name (real LeetCode problem)
2. Topic it covers
3. Difficulty (Easy/Medium/Hard)
4. One-line reason why this problem helps them

Format each as a numbered list. Be encouraging and specific about why each problem was chosen based on their weak areas.`;

    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
}

export async function explainMistake(
    question: string,
    userAnswer: string,
    correctAnswer: string,
    explanation: string
): Promise<string> {
    const model = getModel();

    const prompt = `A student got this DSA question wrong. Help them understand WHY their answer is wrong and the correct way to think about it.

**Question:** ${question}
**Student's Answer:** ${userAnswer}
**Correct Answer:** ${correctAnswer}
**Brief Explanation:** ${explanation}

Provide:
1. Why their answer is wrong (with a clear, relatable analogy)
2. The correct reasoning step-by-step
3. A memorable tip to avoid this mistake in the future
4. One related concept they should review

Be encouraging — mistakes are learning opportunities!`;

    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
}

export async function generatePracticeSet(
    topicName: string,
    difficulty: 'Easy' | 'Medium' | 'Hard'
): Promise<string> {
    const model = getModel();

    const prompt = `Generate a custom practice set of 5 ${difficulty} level DSA problems on the topic "${topicName}".

For each problem:
1. **Problem Name** (use real LeetCode problem names when possible)
2. **Brief Description** (1-2 sentences)
3. **Key Concept** being tested
4. **Approach Hint** (high-level, not the solution)
5. **Estimated Time** to solve

Make this feel like a personalized workout plan for DSA training!`;

    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
}

export async function getHint(
    problem: string,
    hintLevel: 1 | 2 | 3,
    context?: string
): Promise<string> {
    const model = getModel();

    const levelDescriptions: Record<number, string> = {
        1: 'Give a CONCEPTUAL NUDGE only. Ask a guiding question that points them in the right direction. Do NOT mention any specific algorithm or data structure by name. Just help them think about what properties of the problem they should notice.',
        2: 'Give an APPROACH OUTLINE. Name the algorithm/technique they should use, explain WHY it works for this problem, and outline the high-level steps (3-4 steps max). Do NOT write any code.',
        3: 'Give PSEUDOCODE with comments explaining each step. Still do NOT give the final working code — use pseudocode that they need to translate into their language of choice.'
    };

    const prompt = `A student is stuck on this DSA problem and needs a Level ${hintLevel} hint.

**Problem:** ${problem}
${context ? `**Additional Context:** ${context}` : ''}

**Hint Level ${hintLevel} Instructions:** ${levelDescriptions[hintLevel]}

Remember: NEVER give the complete solution. The goal is to help them figure it out themselves.`;

    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
}

export async function chatWithMentor(
    message: string,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
    const model = getModel();

    const historyContext = chatHistory.slice(-6).map(m =>
        `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.content}`
    ).join('\n\n');

    const prompt = `${historyContext ? `**Previous conversation:**\n${historyContext}\n\n` : ''}**Student's new message:** ${message}

Respond as a helpful DSA mentor. Be concise, use markdown formatting, and include code examples when relevant.`;

    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
}

export async function validateApiKey(key: string): Promise<boolean> {
    // Only check format — do NOT make an API call here.
    // This prevents wasting free-tier quota on validation.
    // If the key is truly invalid, the user will see the error on their first chat message.
    if (!key || key.trim().length < 10) return false;
    return true;
}
