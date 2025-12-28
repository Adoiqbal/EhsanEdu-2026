import { CalendarEvent, EventType } from '../types';

const STORAGE_KEY = 'sriie_events_2026';

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Cuti Tahun Baru', date: '2026-01-01', type: EventType.CUTI, description: 'Cuti Umum' },
  { id: '2', title: 'Hari Pendaftaran Sesi Baru', date: '2026-01-03', endDate: '2026-01-04', type: EventType.PENTADBIRAN, description: 'Pendaftaran Murid Tahun 1' },
  { id: '3', title: 'Minggu Orientasi', date: '2026-01-05', endDate: '2026-01-09', type: EventType.HEM, description: 'Untuk semua murid baru' },
  { id: '4', title: 'Mesyuarat Guru Bil 1', date: '2026-01-15', type: EventType.KURIKULUM, description: 'Perancangan Tahunan' },
  { id: '5', title: 'Latihan Rumah Sukan', date: '2026-02-04', type: EventType.KOKO, description: 'Persiapan Hari Sukan' },
  { id: '6', title: 'Sambutan Maulidur Rasul', date: '2026-09-04', type: EventType.DINIAH, description: 'Perarakan dan Ceramah' },
  { id: '7', title: 'Cuti Pertengahan Penggal 1', date: '2026-03-27', endDate: '2026-04-04', type: EventType.CUTI, description: 'Cuti Sekolah' },
];

export const getEvents = (): CalendarEvent[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  return JSON.parse(stored);
};

export const saveEvent = (event: CalendarEvent): CalendarEvent[] => {
  const events = getEvents();
  const newEvents = [...events, event];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
  return newEvents;
};

export const deleteEvent = (id: string): CalendarEvent[] => {
  const events = getEvents();
  const newEvents = events.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
  return newEvents;
};

export const bulkImportEvents = (newEvents: CalendarEvent[]): CalendarEvent[] => {
    const events = getEvents();
    const merged = [...events, ...newEvents];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
}