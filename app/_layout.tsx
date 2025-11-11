import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '@/contexts/UserContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

export default function RootLayout() {
    return (
        <UserProvider>
            <ProgressProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="modules" />
                </Stack>
            </ProgressProvider>
        </UserProvider>
    );
}