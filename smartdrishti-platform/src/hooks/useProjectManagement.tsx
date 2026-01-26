import { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface ProjectStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  timeEstimate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  components: string[];
  duration: string;
  pinoutDiagram?: string;
  blockDiagram?: string;
  procedure: string;
  codeFile?: string;
  conclusion: string;
  references: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  steps?: ProjectStep[];
  progress?: number;
}

export interface ProjectFormData {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  components: string[];
  duration: string;
  pinoutDiagram?: File;
  blockDiagram?: File;
  procedure: string;
  codeFile?: File;
  conclusion: string;
  references: string;
}

interface ProjectContextType {
  projects: Project[];
  isAdmin: boolean;
  isLoading: boolean;
  addProject: (projectData: ProjectFormData) => Promise<void>;
  updateProject: (id: string, projectData: Partial<ProjectFormData>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  searchProjects: (query: string) => Project[];
  filterProjectsByDifficulty: (difficulty: string | null) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate authentication - in real app, this would come from auth context
  useEffect(() => {
    // Check if user is admin (simulated)
    const userRole = localStorage.getItem('userRole') || 'user';
    setIsAdmin(userRole === 'admin');
    
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('smartdrishti_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Initialize with mock data
      initializeMockProjects();
    }
    
    setIsLoading(false);
  }, []);

  const initializeMockProjects = () => {
    const mockProjects: Project[] = [
      {
        id: "proj001",
        title: "Smart Temperature Logger",
        description: "Build a temperature monitoring system using ESP32 and DHT22 sensor with cloud data logging.",
        difficulty: "Easy",
        components: ["ESP32", "DHT22", "Breadboard", "Jumper Wires"],
        duration: "2-3 hours",
        procedure: "1. Install Arduino IDE\n2. Connect DHT22 to ESP32\n3. Write code to read sensor data\n4. Configure WiFi connection\n5. Send data to cloud service",
        conclusion: "This project demonstrates basic IoT concepts including sensor reading, WiFi connectivity, and cloud data logging.",
        references: "https://randomnerdtutorials.com/esp32-dht11-dht22-temperature-humidity-sensor/",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 4.8,
        progress: 100
      },
      {
        id: "proj002",
        title: "Home Automation Hub",
        description: "Create a centralized hub for controlling smart devices using Raspberry Pi and Node-RED.",
        difficulty: "Medium",
        components: ["Raspberry Pi 4", "Relay Module", "Power Supply", "Enclosure"],
        duration: "4-6 hours",
        procedure: "1. Set up Raspberry Pi OS\n2. Install Node-RED\n3. Configure GPIO pins\n4. Build relay circuit\n5. Create dashboard\n6. Test automation flows",
        conclusion: "Successfully created a home automation system that can control appliances remotely.",
        references: "https://nodered.org/docs/getting-started/raspberrypi",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 4.9,
        progress: 100
      }
    ];
    
    setProjects(mockProjects);
    localStorage.setItem('smartdrishti_projects', JSON.stringify(mockProjects));
  };

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('smartdrishti_projects', JSON.stringify(updatedProjects));
  };

  const addProject = async (projectData: ProjectFormData) => {
    setIsLoading(true);
    try {
      // Handle file uploads (in real app, would upload to server)
      const pinoutUrl = projectData.pinoutDiagram ? URL.createObjectURL(projectData.pinoutDiagram) : undefined;
      const blockUrl = projectData.blockDiagram ? URL.createObjectURL(projectData.blockDiagram) : undefined;
      const codeUrl = projectData.codeFile ? URL.createObjectURL(projectData.codeFile) : undefined;

      const newProject: Project = {
        id: `proj${String(projects.length + 1).padStart(3, '0')}`,
        title: projectData.title,
        description: projectData.description,
        difficulty: projectData.difficulty,
        components: projectData.components,
        duration: projectData.duration,
        pinoutDiagram: pinoutUrl,
        blockDiagram: blockUrl,
        procedure: projectData.procedure,
        codeFile: codeUrl,
        conclusion: projectData.conclusion,
        references: projectData.references,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 0,
        progress: 0
      };

      const updatedProjects = [...projects, newProject];
      saveProjects(updatedProjects);
      
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: string, projectData: Partial<ProjectFormData>) => {
    setIsLoading(true);
    try {
      const updatedProjects = projects.map(project => {
        if (project.id === id) {
          return {
            ...project,
            title: projectData.title ?? project.title,
            description: projectData.description ?? project.description,
            difficulty: projectData.difficulty ?? project.difficulty,
            components: projectData.components ?? project.components,
            duration: projectData.duration ?? project.duration,
            procedure: projectData.procedure ?? project.procedure,
            conclusion: projectData.conclusion ?? project.conclusion,
            references: projectData.references ?? project.references,
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      });
      
      saveProjects(updatedProjects);
      
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    setIsLoading(true);
    try {
      const updatedProjects = projects.filter(project => project.id !== id);
      saveProjects(updatedProjects);
      
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const searchProjects = (query: string) => {
    if (!query) return projects;
    const lowerQuery = query.toLowerCase();
    return projects.filter(project => 
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery)
    );
  };

  const filterProjectsByDifficulty = (difficulty: string | null) => {
    if (!difficulty) return projects;
    return projects.filter(project => project.difficulty === difficulty);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      isAdmin,
      isLoading,
      addProject,
      updateProject,
      deleteProject,
      getProjectById,
      searchProjects,
      filterProjectsByDifficulty
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectManagement = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectManagement must be used within a ProjectProvider');
  }
  return context;
};