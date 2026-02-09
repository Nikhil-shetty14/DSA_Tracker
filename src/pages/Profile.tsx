import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirestoreStreak, useProgress, useJournal, useProfile } from '../hooks/useFirestore';
import { User, Camera, Mail, MapPin, Calendar, Save, Edit2 } from 'lucide-react';

interface UserProfileData {
    bio: string;
    location: string;
}

const Profile: React.FC = () => {
    const { user } = useAuth();
    const { streak } = useFirestoreStreak();
    const [progress] = useProgress();
    const [journalEntries] = useJournal();
    const [profileData, setProfileData] = useProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState<UserProfileData>(profileData);

    // Sync temp profile when profile data changes
    useEffect(() => {
        setTempProfile(profileData);
    }, [profileData]);

    const handleSave = () => {
        setProfileData(tempProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempProfile(profileData);
        setIsEditing(false);
    };

    const avatarColors = [
        'bg-gradient-to-br from-blue-500 to-purple-600',
        'bg-gradient-to-br from-green-500 to-teal-600',
        'bg-gradient-to-br from-orange-500 to-red-600',
        'bg-gradient-to-br from-pink-500 to-rose-600',
        'bg-gradient-to-br from-indigo-500 to-blue-600',
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    // Calculate real stats
    const totalSolved = Object.values(progress).reduce((sum, val) => sum + val, 0);
    const badgesEarned = totalSolved >= 100 ? 3 : totalSolved >= 50 ? 2 : totalSolved >= 10 ? 1 : 0;

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Profile</h1>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Card */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

                {/* Avatar & Info */}
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className={`w-24 h-24 rounded-full border-4 border-card flex items-center justify-center text-white text-2xl font-bold ${avatarColors[0]}`}>
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    getInitials(user?.name || 'User')
                                )}
                            </div>
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 mt-4 md:mt-0">
                            <h2 className="text-2xl font-bold">{user?.name || 'DSA Learner'}</h2>
                            <p className="text-muted-foreground mt-1">DSA Enthusiast</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6 space-y-4">
                        {/* Bio */}
                        <div>
                            <label className="text-sm text-muted-foreground block mb-2">About Me</label>
                            {isEditing ? (
                                <textarea
                                    value={tempProfile.bio}
                                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                                    placeholder="Tell us about yourself and your DSA journey..."
                                    className="w-full p-3 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none resize-none h-24"
                                />
                            ) : (
                                <p className="text-foreground/80">
                                    {profileData.bio || 'No bio yet. Click Edit to add one!'}
                                </p>
                            )}
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-lg">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <span className="text-foreground/80">{user?.email || 'Not set'}</span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-lg">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={tempProfile.location}
                                        onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                                        placeholder="Your location"
                                        className="flex-1 bg-transparent border-b border-input focus:border-primary outline-none"
                                    />
                                ) : (
                                    <span className="text-foreground/80">{profileData.location || 'Not set'}</span>
                                )}
                            </div>

                            {/* Join Date */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-lg">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <span className="text-foreground/80">Member since 2024</span>
                            </div>

                            {/* User Icon */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-lg">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <span className="text-foreground/80">DSA Learner</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Summary - Real data from Firestore */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-500">{totalSolved}</div>
                    <div className="text-sm text-muted-foreground">Problems Solved</div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-orange-500">{streak.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-500">{badgesEarned}</div>
                    <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-500">{journalEntries.length}</div>
                    <div className="text-sm text-muted-foreground">Journal Entries</div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
