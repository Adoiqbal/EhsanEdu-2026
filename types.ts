export enum EventType {
  CUTI = 'Cuti',
  KURIKULUM = 'Kurikulum',
  HEM = 'HEM',
  KOKO = 'Koko',
  DINIAH = 'Diniah',
  PENTADBIRAN = 'Pentadbiran Am'
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // Start Date YYYY-MM-DD
  endDate?: string; // End Date YYYY-MM-DD (Optional)
  type: EventType;
  description?: string;
}

export interface MonthData {
  name: string;
  days: number;
  startDay: number; // 0 = Sunday, 1 = Monday, etc.
}

export interface DashboardStats {
  totalEvents: number;
  cuti: number;
  kurikulum: number;
  hem: number;
  koko: number;
  pentadbiran: number;
  diniah: number;
}