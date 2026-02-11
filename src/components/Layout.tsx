import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    BarChart2,
    BookOpen,
    Menu,
    X,
    Trophy,
    Moon,
    Sun,
    User,
    LogOut,
    BrainCircuit,
    Bot,
    Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { useXP } from '../hooks/useFirestore';
import { getLevelProgress } from '../lib/xpSystem';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const { xpData } = useXP();
    const levelProgress = getLevelProgress(xpData.totalXP);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: BarChart2 },
        { path: '/journal', label: 'Journal', icon: BookOpen },
        { path: '/badges', label: 'Badges', icon: Trophy },
        { path: '/aptitude-test', label: 'Test Yourself', icon: BrainCircuit },
        { path: '/ai-mentor', label: 'AI Mentor', icon: Bot },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border transform transition-transform duration-300 md:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <span>DSA Tracker</span>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-8 left-0 w-full px-6 space-y-2">
                    {/* XP Level Indicator */}
                    <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-2">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm">{levelProgress.currentLevel.emoji}</span>
                                <span className="text-xs font-semibold">{levelProgress.currentLevel.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs font-medium text-yellow-400">{xpData.totalXP}</span>
                            </div>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-700 bg-gradient-to-r", levelProgress.currentLevel.color)}
                                style={{ width: `${levelProgress.progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* User Info */}
                    {user && (
                        <div className="px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 mb-2">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-all"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="font-medium">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full md:w-[calc(100%-16rem)] flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-card">
                    <button onClick={toggleSidebar}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg">DSA Tracker</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
