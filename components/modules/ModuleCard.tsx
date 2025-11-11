import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Module } from '@/types/module.types';
import { Colors } from '@/constants/Colors';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ModuleCardProps {
    module: Module;
    progress?: number;
    onPress: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
    module,
    progress = 0,
    onPress,
}) => {
    const getLevelLabel = () => {
        switch (module.level) {
            case 'beginner': return 'Débutant';
            case 'intermediate': return 'Intermédiaire';
            case 'advanced': return 'Avancé';
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={[module.color, module.color + '90']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <Text style={styles.icon}>{module.icon}</Text>
                    <Badge label={getLevelLabel()} variant="info" size="small" />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{module.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {module.description}
                    </Text>

                    <View style={styles.info}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>⏱️ {module.duration}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>⭐ {module.totalXP} XP</Text>
                        </View>
                    </View>

                    {progress > 0 && (
                        <View style={styles.progressContainer}>
                            <ProgressBar progress={progress} color="#fff" showLabel />
                        </View>
                    )}
                </View>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{module.badge}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
    },
    gradient: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    icon: {
        fontSize: 48,
    },
    content: {
        gap: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    description: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        lineHeight: 20,
    },
    info: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    progressContainer: {
        marginTop: 12,
    },
    badge: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});