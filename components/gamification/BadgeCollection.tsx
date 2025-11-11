import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Badge as BadgeType } from '@/types/user.types';
import { Colors } from '@/constants/Colors';

interface BadgeCollectionProps {
    badges: BadgeType[];
    maxDisplay?: number;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
    badges,
    maxDisplay,
}) => {
    const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;

    const getRarityColor = (rarity: BadgeType['rarity']) => {
        switch (rarity) {
            case 'common': return Colors.badgeCommon;
            case 'rare': return Colors.badgeRare;
            case 'epic': return Colors.badgeEpic;
            case 'legendary': return Colors.badgeLegendary;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Badges débloqués</Text>
                <Text style={styles.count}>{badges.length}</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgeList}
            >
                {displayBadges.map((badge) => (
                    <View
                        key={badge.id}
                        style={[
                            styles.badgeItem,
                            { borderColor: getRarityColor(badge.rarity) },
                        ]}
                    >
                        <Text style={styles.badgeIcon}>{badge.icon}</Text>
                        <Text style={styles.badgeName} numberOfLines={1}>
                            {badge.name}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    count: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    badgeList: {
        gap: 12,
        paddingRight: 16,
    },
    badgeItem: {
        width: 80,
        height: 100,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 8,
    },
    badgeIcon: {
        fontSize: 32,
    },
    badgeName: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
    },
});