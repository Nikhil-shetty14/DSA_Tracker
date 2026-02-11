export interface MentorProblem {
    id: string;
    name: string;
    topic: string;
    topicId: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    keyConcept: string;
    leetcodeUrl: string;
}

export const mentorProblems: MentorProblem[] = [
    // ========== ARRAYS ==========
    { id: 'mp-1', name: 'Two Sum', topic: 'Arrays', topicId: 'arrays', difficulty: 'Easy', keyConcept: 'Hash Map lookup', leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
    { id: 'mp-2', name: 'Best Time to Buy and Sell Stock', topic: 'Arrays', topicId: 'arrays', difficulty: 'Easy', keyConcept: 'Tracking minimum', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { id: 'mp-3', name: 'Container With Most Water', topic: 'Arrays', topicId: 'arrays', difficulty: 'Medium', keyConcept: 'Two Pointers', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
    { id: 'mp-4', name: '3Sum', topic: 'Arrays', topicId: 'arrays', difficulty: 'Medium', keyConcept: 'Sorting + Two Pointers', leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
    { id: 'mp-5', name: 'Trapping Rain Water', topic: 'Arrays', topicId: 'arrays', difficulty: 'Hard', keyConcept: 'Two Pointers / Stack', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/' },
    { id: 'mp-6', name: 'Maximum Subarray', topic: 'Arrays', topicId: 'arrays', difficulty: 'Medium', keyConcept: "Kadane's Algorithm", leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/' },

    // ========== STRINGS ==========
    { id: 'mp-7', name: 'Valid Anagram', topic: 'Strings', topicId: 'strings', difficulty: 'Easy', keyConcept: 'Frequency counting', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/' },
    { id: 'mp-8', name: 'Longest Substring Without Repeating Characters', topic: 'Strings', topicId: 'strings', difficulty: 'Medium', keyConcept: 'Sliding Window', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { id: 'mp-9', name: 'Longest Palindromic Substring', topic: 'Strings', topicId: 'strings', difficulty: 'Medium', keyConcept: 'Expand around center', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    { id: 'mp-10', name: 'Group Anagrams', topic: 'Strings', topicId: 'strings', difficulty: 'Medium', keyConcept: 'Sorting + Hash Map', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/' },
    { id: 'mp-11', name: 'Minimum Window Substring', topic: 'Strings', topicId: 'strings', difficulty: 'Hard', keyConcept: 'Sliding Window + Hash Map', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },

    // ========== LINKED LIST ==========
    { id: 'mp-12', name: 'Reverse Linked List', topic: 'Linked List', topicId: 'linked-list', difficulty: 'Easy', keyConcept: 'Pointer manipulation', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/' },
    { id: 'mp-13', name: 'Merge Two Sorted Lists', topic: 'Linked List', topicId: 'linked-list', difficulty: 'Easy', keyConcept: 'Merge technique', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { id: 'mp-14', name: 'Linked List Cycle', topic: 'Linked List', topicId: 'linked-list', difficulty: 'Easy', keyConcept: "Floyd's Algorithm", leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/' },
    { id: 'mp-15', name: 'Remove Nth Node From End', topic: 'Linked List', topicId: 'linked-list', difficulty: 'Medium', keyConcept: 'Two Pointers with gap', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
    { id: 'mp-16', name: 'Merge k Sorted Lists', topic: 'Linked List', topicId: 'linked-list', difficulty: 'Hard', keyConcept: 'Min Heap / Divide & Conquer', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },

    // ========== STACK ==========
    { id: 'mp-17', name: 'Valid Parentheses', topic: 'Stack', topicId: 'stack', difficulty: 'Easy', keyConcept: 'Stack matching', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
    { id: 'mp-18', name: 'Min Stack', topic: 'Stack', topicId: 'stack', difficulty: 'Medium', keyConcept: 'Auxiliary stack', leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
    { id: 'mp-19', name: 'Daily Temperatures', topic: 'Stack', topicId: 'stack', difficulty: 'Medium', keyConcept: 'Monotonic Stack', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/' },
    { id: 'mp-20', name: 'Largest Rectangle in Histogram', topic: 'Stack', topicId: 'stack', difficulty: 'Hard', keyConcept: 'Stack-based area calc', leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },

    // ========== QUEUE ==========
    { id: 'mp-21', name: 'Implement Queue using Stacks', topic: 'Queue', topicId: 'queue', difficulty: 'Easy', keyConcept: 'Two-stack technique', leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
    { id: 'mp-22', name: 'Number of Recent Calls', topic: 'Queue', topicId: 'queue', difficulty: 'Easy', keyConcept: 'Queue sliding window', leetcodeUrl: 'https://leetcode.com/problems/number-of-recent-calls/' },
    { id: 'mp-23', name: 'Sliding Window Maximum', topic: 'Queue', topicId: 'queue', difficulty: 'Hard', keyConcept: 'Monotonic Deque', leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/' },
    { id: 'mp-24', name: 'Design Circular Queue', topic: 'Queue', topicId: 'queue', difficulty: 'Medium', keyConcept: 'Circular buffer', leetcodeUrl: 'https://leetcode.com/problems/design-circular-queue/' },

    // ========== RECURSION ==========
    { id: 'mp-25', name: 'Pow(x, n)', topic: 'Recursion', topicId: 'recursion', difficulty: 'Medium', keyConcept: 'Fast exponentiation', leetcodeUrl: 'https://leetcode.com/problems/powx-n/' },
    { id: 'mp-26', name: 'Subsets', topic: 'Recursion', topicId: 'recursion', difficulty: 'Medium', keyConcept: 'Backtracking', leetcodeUrl: 'https://leetcode.com/problems/subsets/' },
    { id: 'mp-27', name: 'Permutations', topic: 'Recursion', topicId: 'recursion', difficulty: 'Medium', keyConcept: 'Recursive permutation', leetcodeUrl: 'https://leetcode.com/problems/permutations/' },
    { id: 'mp-28', name: 'Letter Combinations of a Phone Number', topic: 'Recursion', topicId: 'recursion', difficulty: 'Medium', keyConcept: 'Recursive enumeration', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
    { id: 'mp-29', name: 'N-Queens', topic: 'Recursion', topicId: 'recursion', difficulty: 'Hard', keyConcept: 'Backtracking with pruning', leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },

    // ========== TREES ==========
    { id: 'mp-30', name: 'Maximum Depth of Binary Tree', topic: 'Trees', topicId: 'trees', difficulty: 'Easy', keyConcept: 'DFS recursion', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { id: 'mp-31', name: 'Invert Binary Tree', topic: 'Trees', topicId: 'trees', difficulty: 'Easy', keyConcept: 'Recursive swap', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/' },
    { id: 'mp-32', name: 'Validate Binary Search Tree', topic: 'Trees', topicId: 'trees', difficulty: 'Medium', keyConcept: 'Inorder / Range check', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/' },
    { id: 'mp-33', name: 'Lowest Common Ancestor of BST', topic: 'Trees', topicId: 'trees', difficulty: 'Medium', keyConcept: 'BST property traversal', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
    { id: 'mp-34', name: 'Binary Tree Level Order Traversal', topic: 'Trees', topicId: 'trees', difficulty: 'Medium', keyConcept: 'BFS with queue', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { id: 'mp-35', name: 'Serialize and Deserialize Binary Tree', topic: 'Trees', topicId: 'trees', difficulty: 'Hard', keyConcept: 'Preorder + Reconstruction', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },

    // ========== GRAPHS ==========
    { id: 'mp-36', name: 'Number of Islands', topic: 'Graphs', topicId: 'graphs', difficulty: 'Medium', keyConcept: 'DFS/BFS flood fill', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/' },
    { id: 'mp-37', name: 'Clone Graph', topic: 'Graphs', topicId: 'graphs', difficulty: 'Medium', keyConcept: 'BFS + Hash Map', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/' },
    { id: 'mp-38', name: 'Course Schedule', topic: 'Graphs', topicId: 'graphs', difficulty: 'Medium', keyConcept: 'Topological Sort', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/' },
    { id: 'mp-39', name: 'Word Ladder', topic: 'Graphs', topicId: 'graphs', difficulty: 'Hard', keyConcept: 'BFS shortest path', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/' },
    { id: 'mp-40', name: 'Pacific Atlantic Water Flow', topic: 'Graphs', topicId: 'graphs', difficulty: 'Medium', keyConcept: 'Multi-source BFS', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
    { id: 'mp-41', name: 'Network Delay Time', topic: 'Graphs', topicId: 'graphs', difficulty: 'Medium', keyConcept: "Dijkstra's Algorithm", leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/' },

    // ========== DYNAMIC PROGRAMMING ==========
    { id: 'mp-42', name: 'Climbing Stairs', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Easy', keyConcept: 'Fibonacci DP', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
    { id: 'mp-43', name: 'House Robber', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Medium', keyConcept: 'Linear DP', leetcodeUrl: 'https://leetcode.com/problems/house-robber/' },
    { id: 'mp-44', name: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Medium', keyConcept: 'LIS with binary search', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    { id: 'mp-45', name: 'Coin Change', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Medium', keyConcept: 'Unbounded Knapsack', leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
    { id: 'mp-46', name: 'Longest Common Subsequence', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Medium', keyConcept: '2D DP table', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/' },
    { id: 'mp-47', name: 'Edit Distance', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Medium', keyConcept: '2D DP with operations', leetcodeUrl: 'https://leetcode.com/problems/edit-distance/' },
    { id: 'mp-48', name: 'Partition Equal Subset Sum', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Medium', keyConcept: '0/1 Knapsack', leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
    { id: 'mp-49', name: 'Word Break', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Medium', keyConcept: 'DP with string matching', leetcodeUrl: 'https://leetcode.com/problems/word-break/' },
    { id: 'mp-50', name: 'Burst Balloons', topic: 'Dynamic Programming', topicId: 'dp', difficulty: 'Hard', keyConcept: 'Interval DP', leetcodeUrl: 'https://leetcode.com/problems/burst-balloons/' },
];
