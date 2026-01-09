
export interface HealthMetric {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

export interface Recommendation {
  id: string;
  category: 'remedy' | 'nutrition' | 'physical' | 'meditation';
  title: string;
  description: string;
  duration: string;
}

export interface BodyPartStatus {
  id: string;
  name: string;
  condition: string;
  healthScore: number;
}

export interface ScanResult {
  timestamp: string;
  heart: HealthMetric;
  kidneys: HealthMetric;
  lungs: HealthMetric;
  external: HealthMetric;
  bodyScore: number;
  summary: string;
}
