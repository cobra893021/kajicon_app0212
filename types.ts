export interface DiagnosisContent {
  title: string;
  basicPersonality: string;
  lifeTrend: string;
  femaleTraits: string;
  maleTraits: string;
  work: string;
  psychegram: {
    features: string;
    interpersonal: string;
    action: string;
    expression: string;
    talent: string;
    male: string;
    female: string;
  };
}

export interface AnimalMapping {
  id: number;
  name: string;
  group: string; // e.g., "F1", "A5"
}

export type FateTable = {
  [year: number]: number[];
};

export interface AnimalFeatureData {
  basicPersonality: string;
  lifeTrend: string;
  femaleTraits: string;
  maleTraits: string;
  work: string;
}