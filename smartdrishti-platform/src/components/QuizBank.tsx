import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Play, Trophy, Clock, BarChart3 } from 'lucide-react';

interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  quizCount: number;
  totalQuizzes: number;
  completedQuizzes: number;
}

interface QuizItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number; // in minutes
  questionCount: number;
  completed: boolean;
  score?: number; // percentage
  lastAttempted?: string;
}

interface QuizBankProps {
  categories: QuizCategory[];
  quizzes: QuizItem[];
  onStartQuiz: (quizId: string) => void;
}

export const QuizBank = ({ categories, quizzes, onStartQuiz }: QuizBankProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedQuizzes = filteredQuizzes.reduce((acc, quiz) => {
    if (!acc[quiz.category]) {
      acc[quiz.category] = [];
    }
    acc[quiz.category].push(quiz);
    return acc;
  }, {} as Record<string, QuizItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quiz Bank</h2>
          <p className="text-muted-foreground">Test your knowledge with our collection of quizzes</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <BarChart3 className="h-4 w-4 mr-2" />
          {quizzes.filter(q => q.completed).length}/{quizzes.length} Quizzes Completed
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory('all')}
              >
                All Quizzes
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  <Badge variant="secondary" className="ml-auto">
                    {category.completedQuizzes}/{category.totalQuizzes}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Overall Progress</span>
                    <span className="text-sm">
                      {quizzes.length > 0 
                        ? Math.round((quizzes.filter(q => q.completed).length / quizzes.length) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={quizzes.length > 0 
                      ? (quizzes.filter(q => q.completed).length / quizzes.length) * 100 
                      : 0
                    } 
                    className="h-2" 
                  />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Achievements</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {quizzes.filter(q => q.completed && q.score && q.score >= 80).length} quizzes with 80%+ scores
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Listings */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {filteredQuizzes.length} quizzes
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quizzes by Category */}
          {Object.entries(groupedQuizzes).map(([categoryId, categoryQuizzes]) => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <div key={categoryId} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">
                    {category?.name || categoryId}
                  </h3>
                  <Badge variant="outline">
                    {categoryQuizzes.length} quizzes
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryQuizzes.map(quiz => (
                    <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={
                                quiz.difficulty === 'beginner' 
                                  ? 'default' 
                                  : quiz.difficulty === 'intermediate' 
                                    ? 'secondary' 
                                    : 'destructive'
                              }>
                                {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                              </Badge>
                              {quiz.completed && quiz.score && (
                                <Badge variant="outline">
                                  Score: {quiz.score}%
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {quiz.timeEstimate} min
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {quiz.questionCount} questions
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{quiz.description}</p>
                        
                        <div className="flex justify-between items-center">
                          {quiz.completed ? (
                            <div className="flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-yellow-500" />
                              <span className="text-sm">
                                Completed {quiz.lastAttempted ? `on ${new Date(quiz.lastAttempted).toLocaleDateString()}` : ''}
                              </span>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Not attempted yet
                            </div>
                          )}
                          
                          <Button 
                            onClick={() => onStartQuiz(quiz.id)}
                            variant={quiz.completed ? "outline" : "default"}
                            className="gap-2"
                          >
                            {quiz.completed ? 'Retake Quiz' : (
                              <>
                                <Play className="h-4 w-4" />
                                Start Quiz
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredQuizzes.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No quizzes found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Sample data for demonstration
export const sampleQuizCategories: QuizCategory[] = [
  {
    id: 'iot-fundamentals',
    name: 'IoT Fundamentals',
    description: 'Basic concepts of Internet of Things',
    icon: '🌐',
    quizCount: 5,
    totalQuizzes: 5,
    completedQuizzes: 3
  },
  {
    id: 'microcontrollers',
    name: 'Microcontrollers',
    description: 'Working with various microcontrollers',
    icon: '⚡',
    quizCount: 7,
    totalQuizzes: 7,
    completedQuizzes: 2
  },
  {
    id: 'sensors-actuators',
    name: 'Sensors & Actuators',
    description: 'Understanding sensors and actuators',
    icon: '📡',
    quizCount: 4,
    totalQuizzes: 4,
    completedQuizzes: 1
  },
  {
    id: 'protocols',
    name: 'Communication Protocols',
    description: 'IoT communication protocols',
    icon: '📡',
    quizCount: 6,
    totalQuizzes: 6,
    completedQuizzes: 4
  }
];

export const sampleQuizzes: QuizItem[] = [
  {
    id: 'iot-basics-1',
    title: 'IoT Basics Quiz',
    description: 'Test your knowledge of fundamental IoT concepts',
    category: 'iot-fundamentals',
    difficulty: 'beginner',
    timeEstimate: 10,
    questionCount: 10,
    completed: true,
    score: 85,
    lastAttempted: '2023-07-15'
  },
  {
    id: 'esp32-quiz',
    title: 'ESP32 Microcontroller Quiz',
    description: 'Learn about ESP32 capabilities and features',
    category: 'microcontrollers',
    difficulty: 'intermediate',
    timeEstimate: 15,
    questionCount: 15,
    completed: true,
    score: 92,
    lastAttempted: '2023-07-18'
  },
  {
    id: 'sensor-types',
    title: 'Sensor Types and Applications',
    description: 'Different types of sensors and their uses',
    category: 'sensors-actuators',
    difficulty: 'intermediate',
    timeEstimate: 12,
    questionCount: 12,
    completed: false
  },
  {
    id: 'mqtt-protocol',
    title: 'MQTT Protocol Deep Dive',
    description: 'Understanding MQTT for IoT communications',
    category: 'protocols',
    difficulty: 'advanced',
    timeEstimate: 20,
    questionCount: 20,
    completed: true,
    score: 78,
    lastAttempted: '2023-07-20'
  },
  {
    id: 'arduino-basics',
    title: 'Arduino Basics Quiz',
    description: 'Fundamentals of Arduino programming',
    category: 'microcontrollers',
    difficulty: 'beginner',
    timeEstimate: 8,
    questionCount: 8,
    completed: false
  },
  {
    id: 'ble-iot',
    title: 'Bluetooth Low Energy in IoT',
    description: 'Using BLE for IoT device communication',
    category: 'protocols',
    difficulty: 'advanced',
    timeEstimate: 18,
    questionCount: 18,
    completed: false
  }
];