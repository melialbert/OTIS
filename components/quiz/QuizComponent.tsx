import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Quiz, QuizQuestion } from '@/types/content.types';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface QuizComponentProps {
    quiz: Quiz;
    onComplete: (score: number, passed: boolean) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleSelectAnswer = (questionId: string, answerId: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handleNext = () => {
        if (!selectedAnswers[currentQuestion.id]) {
            Alert.alert('Attention', 'Veuillez sélectionner une réponse avant de continuer.');
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateResults();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const calculateResults = () => {
        let correctCount = 0;
        let totalPoints = 0;

        questions.forEach((question) => {
            const userAnswer = selectedAnswers[question.id];
            if (userAnswer === question.correct_answer) {
                correctCount++;
                totalPoints += question.points;
            }
        });

        const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
        const percentage = Math.round((totalPoints / maxPoints) * 100);
        const passed = percentage >= quiz.passing_score;

        setScore(percentage);
        setShowResults(true);
        onComplete(percentage, passed);
    };

    const getResultIcon = () => {
        if (score >= 90) return '🎉';
        if (score >= quiz.passing_score) return '✅';
        return '❌';
    };

    const getResultMessage = () => {
        if (score >= 90) return 'Excellent ! Vous maîtrisez parfaitement le sujet.';
        if (score >= quiz.passing_score) return 'Bravo ! Vous avez réussi le quiz.';
        return `Vous n'avez pas atteint le score minimum de ${quiz.passing_score}%. Révisez et réessayez.`;
    };

    if (showResults) {
        return (
            <Card style={styles.resultsCard}>
                <Text style={styles.resultsIcon}>{getResultIcon()}</Text>
                <Text style={styles.resultsTitle}>Résultats du Quiz</Text>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{score}%</Text>
                    <Text style={styles.scoreLabel}>Score obtenu</Text>
                </View>
                <Text style={styles.resultsMessage}>{getResultMessage()}</Text>

                <View style={styles.resultsSummary}>
                    <View style={styles.summaryItem}>
                        <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                        <Text style={styles.summaryText}>
                            {Object.values(selectedAnswers).filter(
                                (answer, index) => answer === questions[index].correct_answer
                            ).length}{' '}
                            / {questions.length}
                        </Text>
                        <Text style={styles.summaryLabel}>Réponses correctes</Text>
                    </View>
                </View>

                <View style={styles.reviewContainer}>
                    <Text style={styles.reviewTitle}>Révision des réponses</Text>
                    <ScrollView style={styles.reviewScroll}>
                        {questions.map((question, index) => {
                            const userAnswer = selectedAnswers[question.id];
                            const isCorrect = userAnswer === question.correct_answer;
                            const selectedOption = question.options.find(
                                (opt) => opt.id === userAnswer
                            );
                            const correctOption = question.options.find(
                                (opt) => opt.id === question.correct_answer
                            );

                            return (
                                <View key={question.id} style={styles.reviewItem}>
                                    <View style={styles.reviewHeader}>
                                        <Text style={styles.reviewQuestionNumber}>Q{index + 1}</Text>
                                        {isCorrect ? (
                                            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                                        ) : (
                                            <Ionicons name="close-circle" size={20} color={Colors.error} />
                                        )}
                                    </View>
                                    <Text style={styles.reviewQuestion}>{question.question_text}</Text>
                                    <Text style={styles.reviewAnswer}>
                                        Votre réponse : <Text style={isCorrect ? styles.correctAnswer : styles.incorrectAnswer}>
                                            {selectedOption?.text}
                                        </Text>
                                    </Text>
                                    {!isCorrect && (
                                        <Text style={styles.reviewAnswer}>
                                            Bonne réponse : <Text style={styles.correctAnswer}>
                                                {correctOption?.text}
                                            </Text>
                                        </Text>
                                    )}
                                    {question.explanation && (
                                        <Text style={styles.reviewExplanation}>
                                            💡 {question.explanation}
                                        </Text>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </Card>
        );
    }

    if (!currentQuestion) {
        return (
            <Card>
                <Text>Aucune question disponible</Text>
            </Card>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
                            ]}
                        />
                    </View>
                </View>
            </Card>

            <Card style={styles.questionCard}>
                <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
                <Text style={styles.questionText}>{currentQuestion.question_text}</Text>

                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[styles.optionButton, isSelected && styles.optionSelected]}
                                onPress={() => handleSelectAnswer(currentQuestion.id, option.id)}
                            >
                                <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                                    {isSelected && <View style={styles.optionRadioDot} />}
                                </View>
                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                    {option.text}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Card>

            <View style={styles.navigationButtons}>
                {currentQuestionIndex > 0 && (
                    <Button
                        title="Précédent"
                        onPress={handlePrevious}
                        variant="outline"
                        style={styles.navButton}
                    />
                )}
                <Button
                    title={currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
                    onPress={handleNext}
                    style={styles.navButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
    },
    progressCard: {
        padding: 12,
    },
    progressHeader: {
        gap: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    progressBar: {
        height: 8,
        backgroundColor: Colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    questionCard: {
        gap: 20,
    },
    questionNumber: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        lineHeight: 26,
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.border,
    },
    optionSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight + '20',
    },
    optionRadio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionRadioSelected: {
        borderColor: Colors.primary,
    },
    optionRadioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        lineHeight: 22,
    },
    optionTextSelected: {
        color: Colors.primary,
        fontWeight: '600',
    },
    navigationButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    navButton: {
        flex: 1,
    },
    resultsCard: {
        alignItems: 'center',
        gap: 16,
        padding: 24,
    },
    resultsIcon: {
        fontSize: 64,
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
    },
    scoreContainer: {
        alignItems: 'center',
        gap: 4,
        marginVertical: 8,
    },
    scoreText: {
        fontSize: 48,
        fontWeight: '700',
        color: Colors.primary,
    },
    scoreLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    resultsMessage: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    resultsSummary: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    summaryItem: {
        alignItems: 'center',
        gap: 8,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    summaryLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    reviewContainer: {
        width: '100%',
        marginTop: 16,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    reviewScroll: {
        maxHeight: 300,
    },
    reviewItem: {
        padding: 16,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reviewQuestionNumber: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
    },
    reviewQuestion: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    reviewAnswer: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    correctAnswer: {
        color: Colors.success,
        fontWeight: '600',
    },
    incorrectAnswer: {
        color: Colors.error,
        fontWeight: '600',
    },
    reviewExplanation: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        marginTop: 4,
        padding: 8,
        backgroundColor: Colors.primaryLight + '10',
        borderRadius: 8,
    },
});
