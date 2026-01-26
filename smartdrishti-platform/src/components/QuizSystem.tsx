import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface QuizSystemProps {
  quiz: Quiz;
  onComplete: (score: number, total: number) => void;
}

export const QuizSystem = ({ quiz, onComplete }: QuizSystemProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = parseInt(value);
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    setIsCompleted(true);
    setShowResults(true);
    
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    onComplete(correctAnswers, quiz.questions.length);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(quiz.questions.length).fill(null));
    setIsCompleted(false);
    setShowResults(false);
  };

  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== null;

  if (showResults) {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const scorePercentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    let performanceLabel = '';
    if (scorePercentage >= 80) performanceLabel = 'Excellent!';
    else if (scorePercentage >= 60) performanceLabel = 'Good Job!';
    else performanceLabel = 'Keep Learning!';

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{scorePercentage}%</div>
            <div className="text-xl text-muted-foreground">{performanceLabel}</div>
            <div className="text-lg mt-2">
              {correctAnswers} out of {quiz.questions.length} correct
            </div>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const isSelected = selectedAnswers[index] !== null;
              const isCorrect = isSelected && selectedAnswers[index] === question.correctAnswer;

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">Question {index + 1}: {question.question}</div>
                  <div className={`text-sm mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {isSelected ? question.options[selectedAnswers[index] as number] : 'No answer'}
                    {!isCorrect && isSelected && (
                      <div className="text-green-600">Correct answer: {question.options[question.correctAnswer]}</div>
                    )}
                  </div>
                  {question.explanation && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Explanation: {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={restartQuiz}>Retake Quiz</Button>
            <Button variant="outline" onClick={() => onComplete(correctAnswers, quiz.questions.length)}>
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{quiz.title}</CardTitle>
            <p className="text-muted-foreground mt-1">{quiz.description}</p>
          </div>
          <Badge variant="outline">{quiz.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
          
          <RadioGroup 
            value={selectedAnswers[currentQuestionIndex]?.toString()} 
            onValueChange={handleAnswerSelect}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion} 
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNextQuestion} 
            disabled={!isAnswerSelected}
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample quiz data for demonstration
export const sampleQuiz: Quiz = {
  id: 'iot-basics-quiz',
  title: 'IoT Basics Quiz',
  description: 'Test your knowledge of fundamental IoT concepts',
  category: 'IoT Fundamentals',
  difficulty: 'beginner',
  questions: [
    {
      id: 'q1',
      question: 'What does IoT stand for?',
      options: [
        'Internet of Things',
        'Internal Operating Technology',
        'Integrated Online Tools',
        'Intelligent Operating Terminals'
      ],
      correctAnswer: 0,
      explanation: 'IoT stands for Internet of Things, which refers to the network of interconnected devices that can collect and exchange data.'
    },
    {
      id: 'q2',
      question: 'Which of the following is NOT a common IoT communication protocol?',
      options: [
        'MQTT',
        'HTTP',
        'CoAP',
        'SMTP'
      ],
      correctAnswer: 3,
      explanation: 'SMTP (Simple Mail Transfer Protocol) is primarily used for email transmission, not for IoT communications.'
    },
    {
      id: 'q3',
      question: 'What is a common challenge in IoT security?',
      options: [
        'Device authentication',
        'Data encryption',
        'Secure firmware updates',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'All of these are significant challenges in IoT security: authenticating devices, encrypting data, and securely updating firmware.'
    }
  ]
};