import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { QuizSystem, sampleQuiz } from '@/components/QuizSystem';
import { InteractiveTutorial, sampleTutorial } from '@/components/InteractiveTutorial';
import { ProgressTracker, sampleProgressData, sampleAchievements, sampleLearningActivities } from '@/components/ProgressTracker';
import { QuizBank, sampleQuizCategories, sampleQuizzes } from '@/components/QuizBank';
import { TutorialBank, sampleTutorialCategories, sampleTutorials } from '@/components/TutorialBank';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, GraduationCap, Target } from 'lucide-react';

export const LearningHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [currentTutorial, setCurrentTutorial] = useState<string | null>(null);

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`Quiz completed: ${score}/${total}`);
    setCurrentQuiz(null); // Return to quiz bank after completion
  };

  const handleTutorialComplete = (completedSteps: number, totalSteps: number) => {
    console.log(`Tutorial completed: ${completedSteps}/${totalSteps}`);
    setCurrentTutorial(null); // Return to tutorial bank after completion
  };

  const handleStartQuiz = (quizId: string) => {
    setCurrentQuiz(quizId);
  };

  const handleStartTutorial = (tutorialId: string) => {
    setCurrentTutorial(tutorialId);
  };

  // If viewing a specific quiz, show the quiz interface
  if (currentQuiz) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuiz(null)}
            className="mb-4"
          >
            ← Back to Quiz Bank
          </Button>
          <QuizSystem 
            quiz={{
              ...sampleQuiz,
              title: `Quiz: ${currentQuiz}`,
              questions: [
                ...sampleQuiz.questions,
                {
                  id: 'q4',
                  question: 'What is the primary advantage of using MQTT in IoT?',
                  options: [
                    'High bandwidth usage',
                    'Lightweight messaging protocol ideal for constrained networks',
                    'Complex authentication mechanisms',
                    'High latency for better reliability'
                  ],
                  correctAnswer: 1,
                  explanation: 'MQTT is a lightweight publish-subscribe messaging protocol ideal for constrained devices and networks with limited bandwidth.'
                }
              ]
            }}
            onComplete={handleQuizComplete}
          />
        </div>
      </DashboardLayout>
    );
  }

  // If viewing a specific tutorial, show the tutorial interface
  if (currentTutorial) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentTutorial(null)}
            className="mb-4"
          >
            ← Back to Tutorial Library
          </Button>
          <InteractiveTutorial
            title={sampleTutorial.title}
            description={sampleTutorial.description}
            steps={sampleTutorial.steps}
            category={sampleTutorial.category}
            difficulty={sampleTutorial.difficulty}
            onComplete={handleTutorialComplete}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">Learning Hub</h1>
            <p className="text-muted-foreground">Enhance your IoT skills with interactive tutorials and quizzes</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <GraduationCap className="h-4 w-4 mr-2" />
            Interactive Learning
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <ProgressTracker 
              progressData={sampleProgressData} 
              achievements={sampleAchievements} 
              recentActivities={sampleLearningActivities} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Next Lesson</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Getting Started with ESP32</h3>
                        <p className="text-sm text-muted-foreground">Continue where you left off</p>
                      </div>
                    </div>
                    <Button>Continue Learning</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Daily Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Take our daily quiz to earn bonus points!</p>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-lg font-bold">?</span>
                      </div>
                      <div>
                        <h3 className="font-medium">IoT Basics Challenge</h3>
                        <p className="text-sm text-muted-foreground">5 questions • 3 min</p>
                      </div>
                    </div>
                    <Button variant="secondary">Start Challenge</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <TutorialBank 
              categories={sampleTutorialCategories} 
              tutorials={sampleTutorials} 
              onStartTutorial={handleStartTutorial} 
            />
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <QuizBank 
              categories={sampleQuizCategories} 
              quizzes={sampleQuizzes} 
              onStartQuiz={handleStartQuiz} 
            />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressTracker 
              progressData={sampleProgressData} 
              achievements={sampleAchievements} 
              recentActivities={sampleLearningActivities} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LearningHub;