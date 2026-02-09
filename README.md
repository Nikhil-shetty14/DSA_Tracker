# 🎯 DSA Tracker

A modern, full-stack web application to track your Data Structures & Algorithms journey with real-time cloud sync, streak tracking, achievements, and more.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-11-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## ✨ Features

### 📊 Progress Dashboard
- Track solved problems across 10+ DSA topics
- Visual progress bars and charts
- Real-time statistics and completion rates

### 🔥 Streak System
- Daily streak tracking to maintain consistency
- Best streak records
- Streak updates automatically when you log problems

### 🏆 Achievement Badges
- 16+ unlockable badges across 4 rarity levels
- Problem-solving milestones (1, 10, 25, 50, 100, 250, 500)
- Streak achievements (3, 7, 14, 30, 100 days)
- Journal and consistency badges
- Progress tracking for locked badges

### 📓 Learning Journal
- Document your DSA journey
- Add notes, reflections, and learnings
- Track your growth over time

### 👤 User Profile
- Customizable profile with bio and location
- Auto-populated from login credentials
- Stats summary and badge count

### 🔐 Authentication
- Email/Password signup and login
- Google Sign-In integration
- Secure session management

### ☁️ Cloud Sync
- Firebase Firestore integration
- Real-time data synchronization
- Access your progress from any device

### 🌓 Dark/Light Mode
- Beautiful theme toggle
- Persisted preference

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Frontend framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Firebase Auth** | Authentication |
| **Firebase Firestore** | Cloud database |
| **React Router** | Navigation |
| **Lucide React** | Icons |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dsa-tracker.git
   cd dsa-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) and:
   - Enable Email/Password and Google authentication
   - Create a Firestore database
   - Copy your config to `src/lib/firebase.ts`:
   
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx       # Main layout with sidebar
│   ├── ProtectedRoute.tsx
│   └── Badges.tsx
├── context/             # React contexts
│   ├── AuthContext.tsx  # Firebase auth state
│   └── ThemeContext.tsx # Theme management
├── hooks/               # Custom React hooks
│   ├── useFirestore.ts  # Firestore data sync
│   ├── useLocalStorage.ts
│   └── useStreak.ts
├── lib/                 # Utilities
│   ├── firebase.ts      # Firebase config
│   └── utils.ts         # Helper functions
├── pages/               # Page components
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Journal.tsx
│   ├── Badges.tsx
│   ├── Profile.tsx
│   ├── Login.tsx
│   └── Signup.tsx
├── data/                # Static data
│   └── topics.ts        # DSA topic definitions
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Screenshots

### Dashboard
Track your progress across all DSA topics with visual charts and stats.

### Badges
Unlock achievements as you solve more problems and maintain streaks.

### Profile
View your stats and customize your profile information.

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy automatically

### Netlify
1. Push to GitHub
2. Import in [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [Firebase](https://firebase.google.com/) for backend services

---

**Happy Coding! 🚀**

*Built with ❤️ for DSA enthusiasts*
