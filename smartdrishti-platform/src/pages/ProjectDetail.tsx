import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: string;
  estimated_time: string;
}

interface Step {
  step_number: number;
  title: string;
  description: string;
  image?: string;
}

interface ApiResponse {
  project: Project;
  steps: Step[];
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`https://iot-web-portal.onrender.com/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data: ApiResponse) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow">{error}</div>
      </div>
    );
  }

  if (!data) return null;
  const { project, steps } = data;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            Difficulty: {project.difficulty}
          </span>
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            Estimated Time: {project.estimated_time}
          </span>
        </div>
        <img
          src={project.image}
          alt={project.title}
          className="w-full max-h-96 object-cover rounded mb-6 shadow"
        />
        <p className="text-gray-700 text-lg mb-4">{project.description}</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tutorial Steps</h2>
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.step_number}
              className="bg-white rounded-lg shadow p-5 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="flex-shrink-0 flex flex-col items-center mr-4">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-bold mb-2">
                  {step.step_number}
                </div>
                {step.image && (
                  <img
                    src={step.image}
                    alt={`Step ${step.step_number}`}
                    className="w-32 h-32 object-cover rounded shadow mt-2"
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-700 mb-2 whitespace-pre-line">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
