import React, { useState } from "react";

interface Step {
  step_number: number;
  title: string;
  description: string;
  materials?: string[];
  image?: string;
}

interface Props {
  steps: Step[];
}

const StepAccordion: React.FC<Props> = ({ steps }) => {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.step_number} className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg focus:outline-none"
            onClick={() => setOpenStep(openStep === step.step_number ? null : step.step_number)}
          >
            <span className="font-semibold">Step {step.step_number}: {step.title}</span>
            <span>{openStep === step.step_number ? "▲" : "▼"}</span>
          </button>
          {openStep === step.step_number && (
            <div className="p-4 bg-white rounded-b-lg">
              <p className="mb-2 text-gray-700 whitespace-pre-line">{step.description}</p>
              {step.materials && step.materials.length > 0 && (
                <ul className="mb-2 list-disc list-inside text-gray-800">
                  {step.materials.map((mat, i) => (
                    <li key={i}>{mat}</li>
                  ))}
                </ul>
              )}
              {step.image && (
                <img src={step.image} alt={step.title} className="mt-2 max-h-60 rounded shadow" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepAccordion;
