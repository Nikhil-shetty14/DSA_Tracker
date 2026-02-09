export interface Quote {
  id: number;
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { id: 1, text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { id: 2, text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { id: 3, text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { id: 4, text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { id: 5, text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { id: 6, text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { id: 7, text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { id: 8, text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
  { id: 9, text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { id: 10, text: "Don't write code that works. Write code that keeps the system working.", author: "Unknown" }
];
