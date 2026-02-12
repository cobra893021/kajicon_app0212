import { FATE_NUMBERS, ANIMAL_TITLES, getPsychegramGroup, GROUP_PSYCHEGRAM } from '../constants';

export interface CalculationResult {
  number: number;
  animalName: string;
  groupCode: string;
  groupData: any;
}

export const calculateDiagnosis = (year: number, month: number, day: number): CalculationResult | null => {
  
  // 1. Validate Year
  if (year < 1960 || year > 2025) {
    return null;
  }

  // 2. Get Fate Number
  const monthIndex = month - 1;
  const fateTable = FATE_NUMBERS[year];
  if (!fateTable) return null;
  
  const fateNumber = fateTable[monthIndex];

  // 3. Calculate Base Number
  let baseNumber = fateNumber + day;

  // 4. Adjust if > 60
  if (baseNumber > 60) {
    baseNumber -= 60;
  }

  // 5. Get Animal Name
  const animalName = ANIMAL_TITLES[baseNumber] || "Unknown Animal";

  // 6. Get Psychegram Group Data
  const groupCode = getPsychegramGroup(baseNumber);
  const groupData = GROUP_PSYCHEGRAM[groupCode];

  return {
    number: baseNumber,
    animalName,
    groupCode,
    groupData
  };
};