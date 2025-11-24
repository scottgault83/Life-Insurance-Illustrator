'use client';

import React, { useState, useEffect } from 'react';
import { Save, Trash2, Copy } from 'lucide-react';
import { CalculatorInputs, Scenario } from '@/lib/types';
import { saveScenario, getAllScenarios, deleteScenario, getScenario } from '@/lib/storage';

interface ScenarioManagerProps {
  currentInputs: CalculatorInputs;
  onLoadScenario: (inputs: CalculatorInputs) => void;
}

export const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  currentInputs,
  onLoadScenario,
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [scenarioName, setScenarioName] = useState('');

  useEffect(() => {
    setScenarios(getAllScenarios());
  }, []);

  const handleSaveScenario = () => {
    if (scenarioName.trim()) {
      const newScenario = saveScenario(scenarioName, currentInputs);
      setScenarios([...scenarios, newScenario]);
      setScenarioName('');
      setShowSaveForm(false);
    }
  };

  const handleDeleteScenario = (id: string) => {
    if (deleteScenario(id)) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  const handleLoadScenario = (id: string) => {
    const scenario = getScenario(id);
    if (scenario) {
      onLoadScenario(scenario.inputs);
    }
  };

  const handleDuplicateScenario = (id: string) => {
    const scenario = getScenario(id);
    if (scenario) {
      const duplicated = saveScenario(`${scenario.name} (Copy)`, scenario.inputs);
      setScenarios([...scenarios, duplicated]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Scenario Manager</h2>

      {/* Save Form */}
      {showSaveForm ? (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter scenario name..."
            value={scenarioName}
            onChange={e => setScenarioName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onKeyPress={e => e.key === 'Enter' && handleSaveScenario()}
          />
          <button
            onClick={handleSaveScenario}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={18} />
            Save
          </button>
          <button
            onClick={() => setShowSaveForm(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSaveForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Save size={18} />
          Save Current Scenario
        </button>
      )}

      {/* Scenarios List */}
      {scenarios.length > 0 ? (
        <div className="space-y-2">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-800">{scenario.name}</p>
                <p className="text-sm text-gray-500">
                  Updated: {new Date(scenario.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLoadScenario(scenario.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                >
                  Load
                </button>
                <button
                  onClick={() => handleDuplicateScenario(scenario.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                >
                  <Copy size={14} />
                  Copy
                </button>
                <button
                  onClick={() => handleDeleteScenario(scenario.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No scenarios saved yet. Save your first scenario above.</p>
      )}
    </div>
  );
};
