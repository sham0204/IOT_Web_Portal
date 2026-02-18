import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiGet from "../api";

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_time: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiGet("/projects?demo=true")
      .then((response) => setProjects(response.data.projects || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <h2 className="text-xl font-bold mb-2">{project.title}</h2>
          <p className="text-gray-700 mb-2">{project.description}</p>
          <div className="flex gap-2 text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.difficulty}</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{project.estimated_time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
