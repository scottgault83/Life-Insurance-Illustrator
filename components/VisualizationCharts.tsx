'use client';

import React from 'react';
import { CalculationRow } from '@/lib/types';

interface VisualizationChartsProps {
  data: CalculationRow[];
}

// This component is now hidden from the main page
// Charts are only shown in PDF exports
export const VisualizationCharts: React.FC<VisualizationChartsProps> = ({ data }) => {
  return null;
};
