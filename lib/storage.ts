import { Scenario, CalculatorInputs } from './types';

const STORAGE_KEY = 'insurance_scenarios';

export function saveScenario(name: string, inputs: CalculatorInputs): Scenario {
  const scenarios = getAllScenarios();

  const newScenario: Scenario = {
    id: Date.now().toString(),
    name,
    inputs,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  scenarios.push(newScenario);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));

  return newScenario;
}

export function getAllScenarios(): Scenario[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getScenario(id: string): Scenario | null {
  const scenarios = getAllScenarios();
  return scenarios.find(s => s.id === id) || null;
}

export function updateScenario(id: string, name: string, inputs: CalculatorInputs): Scenario | null {
  const scenarios = getAllScenarios();
  const index = scenarios.findIndex(s => s.id === id);

  if (index === -1) return null;

  scenarios[index] = {
    ...scenarios[index],
    name,
    inputs,
    updatedAt: new Date(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  return scenarios[index];
}

export function deleteScenario(id: string): boolean {
  const scenarios = getAllScenarios();
  const filtered = scenarios.filter(s => s.id !== id);

  if (filtered.length === scenarios.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}
