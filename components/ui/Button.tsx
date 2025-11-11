import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon,
}) => {
    const buttonStyle = [
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
    ];

    const textStyle = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? Colors.primary : '#fff'} />
            ) : (
                <>
                    {icon}
                    <Text style={textStyle}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: '600',
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: '#fff',
    },
    outlineText: {
        color: Colors.primary,
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
});