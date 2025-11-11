import React, { createContext, useContext, useState, useEffect } from 'react';
import { Progress } from '@/types/progress.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressContextType {
    progress: { [moduleId: string]: Progress };
    updateProgress: (moduleId: string, updates: Partial<Progress>) => void;
    completeActivity: (moduleId: string, activityId: string, xp: number) => void;
    loading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [progress, setProgress] = useState<{ [moduleId: string]: Progress }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const progressData = await AsyncStorage.getItem('progress');
            if (progressData) {
                setProgress(JSON.parse(progressData));
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (moduleId: string, updates: Partial<Progress>) => {
        const currentProgress = progress[moduleId] || {
            moduleId,
            currentWeek: 1,
            currentDay: 1,
            completedActivities: [],
            earnedXP: 0,
            earnedBadges: [],
            startedAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
            completionPercentage: 0,
        };

        const updatedProgress = {
            ...progress,
            [moduleId]: {
                ...currentProgress,
                ...updates,
                lastAccessedAt: new Date().toISOString(),
            },
        };

        setProgress(updatedProgress);

        try {
            await AsyncStorage.setItem('progress', JSON.stringify(updatedProgress));
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const completeActivity = async (moduleId: string, activityId: string, xp: number) => {
        const currentProgress = progress[moduleId];
        if (!currentProgress) return;

        const alreadyCompleted = currentProgress.completedActivities.includes(activityId);
        if (alreadyCompleted) return;

        const updatedCompletedActivities = [...currentProgress.completedActivities, activityId];
        const updatedEarnedXP = currentProgress.earnedXP + xp;

        await updateProgress(moduleId, {
            completedActivities: updatedCompletedActivities,
            earnedXP: updatedEarnedXP,
        });
    };

    return (
        <ProgressContext.Provider value={{ progress, updateProgress, completeActivity, loading }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};