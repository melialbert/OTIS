import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Badge } from '@/types/user.types';
import { calculateLevel, calculateXPForNextLevel, calculateCurrentLevelXP } from '@/constants/Gamification';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
    user: User | null;
    updateUser: (updates: Partial<User>) => void;
    addXP: (amount: number) => void;
    addBadge: (badge: Badge) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER: User = {
    id: '1',
    name: 'Utilisateur OTIS',
    email: 'user@otis.app',
    level: 1,
    totalXP: 0,
    currentXP: 0,
    xpToNextLevel: 500,
    badges: [],
    completedModules: [],
    joinedDate: new Date().toISOString(),
    skills: [
        { name: 'Photographie', level: 0, maxLevel: 100 },
        { name: 'Vidéographie', level: 0, maxLevel: 100 },
        { name: 'Montage', level: 0, maxLevel: 100 },
        { name: 'Créativité', level: 0, maxLevel: 100 },
        { name: 'Technique', level: 0, maxLevel: 100 },
    ],
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                setUser(DEFAULT_USER);
                await AsyncStorage.setItem('user', JSON.stringify(DEFAULT_USER));
            }
        } catch (error) {
            console.error('Error loading user:', error);
            setUser(DEFAULT_USER);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user) return;

        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        try {
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const addXP = async (amount: number) => {
        if (!user) return;

        const newTotalXP = user.totalXP + amount;
        const newLevel = calculateLevel(newTotalXP);
        const leveledUp = newLevel > user.level;

        const updatedUser = {
            ...user,
            totalXP: newTotalXP,
            level: newLevel,
            currentXP: calculateCurrentLevelXP(newTotalXP),
            xpToNextLevel: calculateXPForNextLevel(newTotalXP),
        };

        setUser(updatedUser);

        try {
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error adding XP:', error);
        }

        if (leveledUp) {
            // Notification de niveau up (à implémenter)
            console.log('Level Up!', newLevel);
        }
    };

    const addBadge = async (badge: Badge) => {
        if (!user) return;

        const badgeWithDate = {
            ...badge,
            unlockedAt: new Date().toISOString(),
        };

        const updatedUser = {
            ...user,
            badges: [...user.badges, badgeWithDate],
        };

        setUser(updatedUser);

        try {
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error adding badge:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, updateUser, addXP, addBadge, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};