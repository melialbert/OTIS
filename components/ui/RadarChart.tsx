import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

interface RadarChartProps {
    data: { name: string; value: number; maxValue: number }[];
    size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
    const center = size / 2;
    const maxRadius = size / 2 - 40;
    const angleStep = (Math.PI * 2) / data.length;

    const getPoint = (value: number, maxValue: number, index: number) => {
        const ratio = value / maxValue;
        const angle = angleStep * index - Math.PI / 2;
        const radius = maxRadius * ratio;
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        };
    };

    const getLabelPoint = (index: number) => {
        const angle = angleStep * index - Math.PI / 2;
        const radius = maxRadius + 20;
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        };
    };

    const dataPoints = data.map((item, index) =>
        getPoint(item.value, item.maxValue, index)
    );

    const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

    const backgroundLevels = [0.25, 0.5, 0.75, 1];

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                {/* Background grid */}
                {backgroundLevels.map((level, i) => {
                    const bgPoints = data.map((_, index) => {
                        const point = getPoint(level * data[index].maxValue, data[index].maxValue, index);
                        return `${point.x},${point.y}`;
                    }).join(' ');

                    return (
                        <Polygon
                            key={i}
                            points={bgPoints}
                            fill="none"
                            stroke={Colors.border}
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Axis lines */}
                {data.map((_, index) => {
                    const point = getPoint(data[index].maxValue, data[index].maxValue, index);
                    return (
                        <Line
                            key={index}
                            x1={center}
                            y1={center}
                            x2={point.x}
                            y2={point.y}
                            stroke={Colors.border}
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data polygon */}
                <Polygon
                    points={polygonPoints}
                    fill={Colors.primary + '40'}
                    stroke={Colors.primary}
                    strokeWidth="2"
                />

                {/* Data points */}
                {dataPoints.map((point, index) => (
                    <Circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill={Colors.primary}
                    />
                ))}

                {/* Labels */}
                {data.map((item, index) => {
                    const labelPoint = getLabelPoint(index);
                    return (
                        <SvgText
                            key={index}
                            x={labelPoint.x}
                            y={labelPoint.y}
                            fontSize="10"
                            fill={Colors.text}
                            textAnchor="middle"
                        >
                            {item.name}
                        </SvgText>
                    );
                })}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});