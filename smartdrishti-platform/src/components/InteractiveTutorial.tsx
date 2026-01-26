import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, RotateCcw, CheckCircle, Circle } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif';
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  };
  isCompleted?: boolean;
}

interface InteractiveTutorialProps {
  title: string;
  description: string;
  steps: TutorialStep[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onComplete: (completedSteps: number, totalSteps: number) => void;
}

export const InteractiveTutorial = ({ 
  title, 
  description, 
  steps, 
  category, 
  difficulty, 
  onComplete 
}: InteractiveTutorialProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number | null}>({});
  const [showQuizFeedback, setShowQuizFeedback] = useState<{[key: string]: boolean}>({});

  const currentStep = steps[currentStepIndex];
  const progress = ((completedSteps.length) / steps.length) * 100;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isStepCompleted = completedSteps.includes(currentStepIndex);
  const hasQuiz = !!currentStep.quiz;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextStep = () => {
    if (isLastStep) {
      // Tutorial completed
      if (!completedSteps.includes(currentStepIndex)) {
        markStepComplete();
      }
      onComplete(completedSteps.length + 1, steps.length);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const markStepComplete = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
  };

  const handleQuizSubmit = (stepId: string) => {
    if (!currentStep.quiz) return;
    
    const selectedAnswer = quizAnswers[stepId];
    if (selectedAnswer === null || selectedAnswer === undefined) return;
    
    const isCorrect = selectedAnswer === currentStep.quiz.correctAnswer;
    setShowQuizFeedback({...showQuizFeedback, [stepId]: isCorrect});
    
    if (isCorrect) {
      setTimeout(() => {
        markStepComplete();
        if (isLastStep) {
          onComplete(completedSteps.length + 1, steps.length);
        } else {
          setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 1000);
        }
      }, 1500);
    }
  };

  const handleQuizChange = (stepId: string, value: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [stepId]: parseInt(value)
    });
    
    // Reset feedback when answer changes
    if (showQuizFeedback[stepId] !== undefined) {
      const newFeedback = {...showQuizFeedback};
      delete newFeedback[stepId];
      setShowQuizFeedback(newFeedback);
    }
  };

  const restartTutorial = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setQuizAnswers({});
    setShowQuizFeedback({});
    setIsPlaying(false);
  };

  // Auto-advance when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isStepCompleted && !hasQuiz) {
      interval = setInterval(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 5000); // Advance every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, isStepCompleted, hasQuiz, steps.length]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{category}</Badge>
            <Badge variant={difficulty === 'beginner' ? 'default' : difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{completedSteps.length} of {steps.length} steps completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevStep} 
            disabled={currentStepIndex === 0}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={togglePlayPause}
              disabled={isStepCompleted || hasQuiz}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={restartTutorial}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {isStepCompleted ? (
            <Button variant="outline" disabled>
              Completed <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          ) : hasQuiz ? (
            <Button 
              onClick={() => handleQuizSubmit(currentStep.id)}
              disabled={quizAnswers[currentStep.id] === null || quizAnswers[currentStep.id] === undefined}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={markStepComplete}>
              Mark Complete
            </Button>
          )}
        </div>

        {/* Step Content */}
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">{currentStep.title}</h3>
            <Badge variant="outline">Step {currentStepIndex + 1}</Badge>
          </div>
          
          <p className="text-muted-foreground mb-4">{currentStep.description}</p>
          
          <div className="prose max-w-none">
            {currentStep.mediaUrl && (
              <div className="mb-4">
                {currentStep.mediaType === 'image' ? (
                  <img 
                    src={currentStep.mediaUrl} 
                    alt={currentStep.title} 
                    className="rounded-lg border w-full max-h-80 object-contain"
                  />
                ) : currentStep.mediaType === 'video' ? (
                  <video 
                    src={currentStep.mediaUrl} 
                    controls 
                    className="rounded-lg border w-full max-h-80"
                  />
                ) : currentStep.mediaType === 'gif' ? (
                  <img 
                    src={currentStep.mediaUrl} 
                    alt={currentStep.title} 
                    className="rounded-lg border w-full max-h-80"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
                    Media Placeholder
                  </div>
                )}
              </div>
            )}
            
            <div dangerouslySetInnerHTML={{ __html: currentStep.content }} />
          </div>
          
          {/* Quiz Section */}
          {hasQuiz && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3">Knowledge Check</h4>
              <div className="space-y-3">
                {currentStep.quiz!.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={`quiz-option-${currentStep.id}-${index}`}
                      name={`quiz-${currentStep.id}`}
                      value={index}
                      checked={quizAnswers[currentStep.id] === index}
                      onChange={(e) => handleQuizChange(currentStep.id, e.target.value)}
                      disabled={showQuizFeedback[currentStep.id] !== undefined}
                      className="h-4 w-4"
                    />
                    <label 
                      htmlFor={`quiz-option-${currentStep.id}-${index}`} 
                      className="text-base"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              
              {showQuizFeedback[currentStep.id] !== undefined && (
                <div className={`mt-3 p-3 rounded-lg ${showQuizFeedback[currentStep.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {showQuizFeedback[currentStep.id] 
                    ? 'Correct! Well done.' 
                    : `Incorrect. ${currentStep.quiz?.explanation || 'Review the material and try again.'}`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step Progress Indicators */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-3 h-3 rounded-full ${
                  index === currentStepIndex 
                    ? 'bg-primary ring-2 ring-primary/50' 
                    : completedSteps.includes(index) 
                      ? 'bg-green-500' 
                      : 'bg-muted'
                }`}
              />
              <span className={`text-xs mt-1 ${index === currentStepIndex ? 'font-bold' : ''}`}>
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Sample tutorial data for demonstration
export const sampleTutorial = {
  title: 'Getting Started with ESP32',
  description: 'Learn the basics of ESP32 microcontroller and get your first IoT project running',
  category: 'Microcontrollers',
  difficulty: 'beginner' as const,
  steps: [
    {
      id: 'step1',
      title: 'Introduction to ESP32',
      description: 'Understanding the ESP32 microcontroller',
      content: `
        <p>The ESP32 is a powerful microcontroller with built-in WiFi and Bluetooth capabilities. It's perfect for IoT projects due to its:</p>
        <ul class="list-disc pl-5 mt-2">
          <li>Dual-core processor</li>
          <li>Integrated WiFi and Bluetooth</li>
          <li>Low power consumption</li>
          <li>Rich set of peripherals</li>
        </ul>
      `,
      mediaUrl: '/placeholder-esp32.jpg',
      mediaType: 'image' as const,
    },
    {
      id: 'step2',
      title: 'Setting Up Development Environment',
      description: 'Installing the necessary software',
      content: `
        <p>To develop for ESP32, you'll need to set up your development environment:</p>
        <ol class="list-decimal pl-5 mt-2">
          <li>Install Arduino IDE or VSCode with ESP32 extension</li>
          <li>Add ESP32 board definitions</li>
          <li>Install required drivers</li>
          <li>Test your setup with a simple blink example</li>
        </ol>
      `,
      quiz: {
        question: 'Which of the following is NOT required to set up ESP32 development?',
        options: [
          'Arduino IDE or VSCode',
          'ESP32 board definitions',
          'A physical ESP32 board',
          'USB driver for your computer'
        ],
        correctAnswer: 2,
        explanation: 'While having a physical ESP32 board is helpful for testing, you can set up the development environment without the physical board.'
      }
    },
    {
      id: 'step3',
      title: 'First Program - Blink LED',
      description: 'Writing and uploading your first program',
      content: `
        <p>Let's write a simple program to blink the onboard LED:</p>
        <pre class="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
void setup() {
  pinMode(2, OUTPUT); // GPIO2 is usually the onboard LED
}

void loop() {
  digitalWrite(2, HIGH);
  delay(1000);
  digitalWrite(2, LOW);
  delay(1000);
}
        </pre>
        <p>Upload this code to your ESP32 and watch the LED blink!</p>
      `,
      mediaUrl: '/placeholder-blink.gif',
      mediaType: 'gif' as const,
    }
  ]
};