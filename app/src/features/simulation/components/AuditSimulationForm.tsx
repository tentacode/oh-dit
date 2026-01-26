"use client";

import { useState } from "react";
import { PAGE_RANGES, COMPLEXITY_LEVELS } from "../config/pricing";

export default function AuditSimulationForm() {
  const [selectedRangeIndex, setSelectedRangeIndex] = useState<number>(0);
  const [complexityValue, setComplexityValue] = useState<number>(1);

  const calculatePrice = (): number => {
    const selectedRange = PAGE_RANGES[selectedRangeIndex];
    const selectedComplexity = COMPLEXITY_LEVELS[complexityValue];

    return selectedRange.basePrice * selectedComplexity.factor;
  };

  const price = calculatePrice();
  const currentComplexity = COMPLEXITY_LEVELS[complexityValue];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="h1 mb-6">Simulation d'audit RGAA</h1>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de pages
          </label>
          <select
            value={selectedRangeIndex}
            onChange={(e) => setSelectedRangeIndex(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_RANGES.map((range, index) => (
              <option key={index} value={index}>
                {range.label} - {range.basePrice}€ HT
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complexité: {currentComplexity.label} (x{currentComplexity.factor})
          </label>
          <input
            type="range"
            min="0"
            max={COMPLEXITY_LEVELS.length - 1}
            step="1"
            value={complexityValue}
            onChange={(e) => setComplexityValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Très simple</span>
            <span>Très complexe</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Prix total HT:</div>
          <div className="text-3xl font-bold text-blue-600">
            {price.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}€
          </div>
        </div>
      </div>
    </div>
  );
}
