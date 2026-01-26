import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TestNavigation = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  
  useEffect(() => {
    console.log("TestNavigation mounted");
    console.log("projectId:", projectId);
    
    if (!projectId) {
      console.log("No projectId, navigating to project 3");
      navigate("/projects/3");
    } else {
      console.log("Already on project page:", projectId);
    }
  }, [navigate, projectId]);
  
  return (
    <div>
      <h1>Test Navigation</h1>
      <p>Current projectId: {projectId || "None"}</p>
      <button onClick={() => navigate("/projects/3")}>
        Go to Project 3
      </button>
      <button onClick={() => navigate("/projects")}>
        Back to Projects
      </button>
    </div>
  );
};

export default TestNavigation;