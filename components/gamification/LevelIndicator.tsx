import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface LevelIndicatorProps {
    level: number;
    size?: number;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
    level,
    size = 50,
}) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Text style={[styles.level, { fontSize: size * 0.4 }]}>{level}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.primaryLight,
    },
    level: {
        color: '#fff',
        fontWeight: '700',
    },
});