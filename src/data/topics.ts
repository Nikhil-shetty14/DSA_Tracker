export interface Topic {
    id: string;
    name: string;
    defaultTotal: number;
}

export const topics: Topic[] = [
    { id: 'arrays', name: 'Arrays', defaultTotal: 50 },
    { id: 'strings', name: 'Strings', defaultTotal: 40 },
    { id: 'linked-list', name: 'Linked List', defaultTotal: 30 },
    { id: 'stack', name: 'Stack', defaultTotal: 20 },
    { id: 'queue', name: 'Queue', defaultTotal: 20 },
    { id: 'recursion', name: 'Recursion', defaultTotal: 25 },
    { id: 'trees', name: 'Trees', defaultTotal: 40 },
    { id: 'graphs', name: 'Graphs', defaultTotal: 40 },
    { id: 'dp', name: 'Dynamic Programming', defaultTotal: 50 },
];
