import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Play, BookOpen, Clock, CheckCircle, Circle } from 'lucide-react';

interface TutorialCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  tutorialCount: number;
  totalTutorials: number;
  completedTutorials: number;
}

interface TutorialItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number; // in minutes
  stepCount: number;
  completed: boolean;
  progress?: number; // percentage
  lastAccessed?: string;
}

interface TutorialBankProps {
  categories: TutorialCategory[];
  tutorials: TutorialItem[];
  onStartTutorial: (tutorialId: string) => void;
}

export const TutorialBank = ({ categories, tutorials, onStartTutorial }: TutorialBankProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedTutorials = filteredTutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.category]) {
      acc[tutorial.category] = [];
    }
    acc[tutorial.category].push(tutorial);
    return acc;
  }, {} as Record<string, TutorialItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tutorial Library</h2>
          <p className="text-muted-foreground">Learn IoT concepts with step-by-step tutorials</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <BookOpen className="h-4 w-4 mr-2" />
          {tutorials.filter(t => t.completed).length}/{tutorials.length} Tutorials Completed
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
                All Tutorials
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
                    {category.completedTutorials}/{category.totalTutorials}
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
                      {tutorials.length > 0 
                        ? Math.round((tutorials.filter(t => t.completed).length / tutorials.length) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={tutorials.length > 0 
                      ? (tutorials.filter(t => t.completed).length / tutorials.length) * 100 
                      : 0
                    } 
                    className="h-2" 
                  />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">Learning Time</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tutorials.reduce((sum, t) => sum + (t.completed ? t.timeEstimate : 0), 0)} min completed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tutorial Listings */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search tutorials..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {filteredTutorials.length} tutorials
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutorials by Category */}
          {Object.entries(groupedTutorials).map(([categoryId, categoryTutorials]) => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <div key={categoryId} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">
                    {category?.name || categoryId}
                  </h3>
                  <Badge variant="outline">
                    {categoryTutorials.length} tutorials
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryTutorials.map(tutorial => (
                    <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={
                                tutorial.difficulty === 'beginner' 
                                  ? 'default' 
                                  : tutorial.difficulty === 'intermediate' 
                                    ? 'secondary' 
                                    : 'destructive'
                              }>
                                {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
                              </Badge>
                              {tutorial.completed && (
                                <Badge variant="outline">
                                  Completed
                                </Badge>
                              )}
                              {!tutorial.completed && tutorial.progress && tutorial.progress > 0 && (
                                <Badge variant="outline">
                                  {Math.round(tutorial.progress)}% Complete
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {tutorial.timeEstimate} min
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {tutorial.stepCount} steps
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{tutorial.description}</p>
                        
                        <div className="flex justify-between items-center">
                          {tutorial.completed ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-sm">
                                Completed {tutorial.lastAccessed ? `on ${new Date(tutorial.lastAccessed).toLocaleDateString()}` : ''}
                              </span>
                            </div>
                          ) : tutorial.progress && tutorial.progress > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Circle className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm">
                                  In progress ({Math.round(tutorial.progress)}%)
                                </span>
                              </div>
                              <Progress value={tutorial.progress} className="h-2" />
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Not started yet
                            </div>
                          )}
                          
                          <Button 
                            onClick={() => onStartTutorial(tutorial.id)}
                            variant={tutorial.completed ? "outline" : "default"}
                            className="gap-2"
                          >
                            {tutorial.completed ? 'Review Tutorial' : 
                             (tutorial.progress && tutorial.progress > 0 ? 'Continue' : 
                             (
                               <>
                                 <Play className="h-4 w-4" />
                                 Start Tutorial
                               </>
                             ))}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredTutorials.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tutorials found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Sample data for demonstration
export const sampleTutorialCategories: TutorialCategory[] = [
  {
    id: 'iot-fundamentals',
    name: 'IoT Fundamentals',
    description: 'Basic concepts of Internet of Things',
    icon: '🌐',
    tutorialCount: 4,
    totalTutorials: 4,
    completedTutorials: 1
  },
  {
    id: 'microcontrollers',
    name: 'Microcontrollers',
    description: 'Working with various microcontrollers',
    icon: '⚡',
    tutorialCount: 6,
    totalTutorials: 6,
    completedTutorials: 2
  },
  {
    id: 'sensors-actuators',
    name: 'Sensors & Actuators',
    description: 'Understanding sensors and actuators',
    icon: '📡',
    tutorialCount: 5,
    totalTutorials: 5,
    completedTutorials: 0
  },
  {
    id: 'protocols',
    name: 'Communication Protocols',
    description: 'IoT communication protocols',
    icon: '📡',
    tutorialCount: 3,
    totalTutorials: 3,
    completedTutorials: 1
  }
];

export const sampleTutorials: TutorialItem[] = [
  {
    id: 'getting-started-esp32',
    title: 'Getting Started with ESP32',
    description: 'Learn the basics of ESP32 microcontroller and get your first IoT project running',
    category: 'microcontrollers',
    difficulty: 'beginner',
    timeEstimate: 45,
    stepCount: 5,
    completed: true,
    progress: 100,
    lastAccessed: '2023-07-15'
  },
  {
    id: 'arduino-uno-basics',
    title: 'Arduino Uno Basics',
    description: 'Introduction to Arduino Uno and basic electronics',
    category: 'microcontrollers',
    difficulty: 'beginner',
    timeEstimate: 30,
    stepCount: 4,
    completed: false,
    progress: 60
  },
  {
    id: 'temperature-sensor',
    title: 'Temperature Sensor Project',
    description: 'Build a temperature monitoring system with DS18B20 sensor',
    category: 'sensors-actuators',
    difficulty: 'intermediate',
    timeEstimate: 60,
    stepCount: 7,
    completed: false
  },
  {
    id: 'mqtt-integration',
    title: 'MQTT Integration',
    description: 'Connect your device to MQTT broker for remote monitoring',
    category: 'protocols',
    difficulty: 'intermediate',
    timeEstimate: 40,
    stepCount: 6,
    completed: true,
    progress: 100,
    lastAccessed: '2023-07-18'
  },
  {
    id: 'iot-security',
    title: 'IoT Security Best Practices',
    description: 'Learn how to secure your IoT devices and data',
    category: 'iot-fundamentals',
    difficulty: 'advanced',
    timeEstimate: 75,
    stepCount: 8,
    completed: false
  },
  {
    id: 'wifi-connectivity',
    title: 'WiFi Connectivity',
    description: 'Connect your device to WiFi and access the internet',
    category: 'iot-fundamentals',
    difficulty: 'beginner',
    timeEstimate: 25,
    stepCount: 3,
    completed: true,
    progress: 100,
    lastAccessed: '2023-07-20'
  }
];