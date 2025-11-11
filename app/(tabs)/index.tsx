import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '@/contexts/ProgressContext';
import { Colors } from '@/constants/Colors';
import { MODULES } from '@/constants/Modules';
import { ModuleCard } from '@/components/modules/ModuleCard';
import { Badge } from '@/components/ui/Badge';

export default function ModulesScreen() {
    const router = useRouter();
    const { progress } = useProgress();
    const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

    const filteredModules = MODULES.filter(module => {
        if (filter === 'all') return true;
        return module.level === filter;
    });

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Description */}
                <View style={styles.header}>
                    <Text style={styles.description}>
                        Explore nos modules de formation créative et développe tes compétences en photographie, vidéo et montage.
                    </Text>
                </View>

                {/* Filtres */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filters}
                >
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            Tous
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'beginner' && styles.filterButtonActive]}
                        onPress={() => setFilter('beginner')}
                    >
                        <Text style={[styles.filterText, filter === 'beginner' && styles.filterTextActive]}>
                            Débutant
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'intermediate' && styles.filterButtonActive]}
                        onPress={() => setFilter('intermediate')}
                    >
                        <Text style={[styles.filterText, filter === 'intermediate' && styles.filterTextActive]}>
                            Intermédiaire
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'advanced' && styles.filterButtonActive]}
                        onPress={() => setFilter('advanced')}
                    >
                        <Text style={[styles.filterText, filter === 'advanced' && styles.filterTextActive]}>
                            Avancé
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Liste des modules */}
                <View style={styles.modulesList}>
                    {filteredModules.map((module) => {
                        const moduleProgress = progress[module.id];
                        return (
                            <ModuleCard
                                key={module.id}
                                module={module}
                                progress={moduleProgress?.completionPercentage || 0}
                                onPress={() => router.push(`/modules/${module.id}`)}
                            />
                        );
                    })}
                </View>

                {/* Stats globales */}
                <View style={styles.statsSection}>
                    <Text style={styles.statsTitle}>📊 Statistiques globales</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{MODULES.length}</Text>
                            <Text style={styles.statLabel}>Modules disponibles</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {MODULES.reduce((sum, m) => sum + m.totalXP, 0)}
                            </Text>
                            <Text style={styles.statLabel}>XP total possible</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {MODULES.reduce((sum, m) => sum + m.weeks.length, 0)}
                            </Text>
                            <Text style={styles.statLabel}>Semaines de contenu</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    header: {
        padding: 16,
        paddingTop: 8,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    filters: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    filterButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    filterTextActive: {
        color: '#fff',
    },
    modulesList: {
        padding: 16,
    },
    statsSection: {
        padding: 16,
        gap: 12,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statItem: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: 11,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});