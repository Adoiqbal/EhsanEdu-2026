import React, { useState, useMemo } from 'react';
import { CalendarEvent, EventType } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from './Dashboard';

interface CalendarViewProps {
  events: CalendarEvent[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Helper to check if a day is within an event's range
  const isDateInRange = (dateStr: string, event: CalendarEvent) => {
    const d = new Date(dateStr);
    const start = new Date(event.date);
    const end = event.endDate ? new Date(event.endDate) : new Date(event.date);
    
    // Reset times to compare only dates
    d.setHours(0,0,0,0);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    return d >= start && d <= end;
  };

  const monthEvents = useMemo(() => {
    // Filter events that touch this month
    return events.filter(e => {
        const start = new Date(e.date);
        const end = e.endDate ? new Date(e.endDate) : new Date(e.date);
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);

        return start <= monthEnd && end >= monthStart;
    });
  }, [events, month, year]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderDays = () => {
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const slots = [...blanks, ...days];

    return slots.map((day, index) => {
      if (day === null) {
        return <div key={`blank-${index}`} className="bg-slate-50/50 min-h-[110px] sm:min-h-[140px] border-b border-r border-slate-100"></div>;
      }

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dailyEvents = monthEvents.filter(e => isDateInRange(dateStr, e));

      return (
        <div key={day} className="bg-white min-h-[110px] sm:min-h-[140px] p-1.5 border-b border-r border-slate-100 hover:bg-slate-50 transition-colors group relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-start mb-1.5">
            <span className={`text-sm sm:text-base font-bold ml-1 ${dailyEvents.some(e => e.type === EventType.CUTI) ? 'text-red-500' : 'text-slate-700'}`}>
              {day}
            </span>
            {dailyEvents.length > 0 && (
                <span className="text-[10px] text-slate-400 font-medium sm:hidden bg-slate-100 px-1.5 rounded-full">
                    {dailyEvents.length}
                </span>
            )}
          </div>
          
          <div className="space-y-1 flex-1">
            {dailyEvents.map(event => (
              <div 
                key={event.id} 
                className={`text-[10px] sm:text-xs px-1.5 py-1 rounded-md border-l-[3px] font-medium truncate shadow-sm transition-all hover:opacity-80 cursor-help
                  ${event.type === EventType.CUTI ? 'bg-red-50 border-red-400 text-red-700' : 
                    event.type === EventType.KURIKULUM ? 'bg-blue-50 border-blue-400 text-blue-700' :
                    event.type === EventType.HEM ? 'bg-orange-50 border-orange-400 text-orange-700' :
                    event.type === EventType.KOKO ? 'bg-emerald-50 border-emerald-400 text-emerald-700' :
                    event.type === EventType.DINIAH ? 'bg-purple-50 border-purple-400 text-purple-700' :
                    'bg-slate-50 border-slate-400 text-slate-700'}
                `}
                title={`${event.title}${event.endDate ? ` (Until ${event.endDate})` : ''}`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full">
        {/* Main Calendar Grid */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-white border-b border-slate-200 z-20 relative">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                    {MONTHS[month]} <span className="text-slate-400 font-light">{year}</span>
                </h2>
                <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                    <ChevronRight size={20} />
                </button>
                </div>
            </div>

            {/* Scrollable Container for Grid */}
            <div className="flex-1 overflow-auto bg-slate-100">
                <div className="min-w-[800px] h-full flex flex-col bg-white">
                    {/* Grid Header - Sticky */}
                    <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 flex-shrink-0 sticky top-0 z-10 shadow-sm">
                        {DAYS.map(d => (
                        <div key={d} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {d}
                        </div>
                        ))}
                    </div>

                    {/* Grid Body */}
                    <div className="grid grid-cols-7 bg-slate-200 gap-px border-l border-t border-slate-200 flex-1">
                        {renderDays()}
                    </div>
                </div>
            </div>
        </div>

        {/* Side Panel: Summary of Month */}
        <div className="w-full xl:w-80 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-[400px] xl:h-auto overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Summary: {MONTHS[month]}</h3>
                <p className="text-xs text-slate-500">{monthEvents.length} events scheduled</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {monthEvents.sort((a,b) => a.date.localeCompare(b.date)).map(event => (
                    <div key={event.id} className="p-3 rounded-lg border border-slate-100 hover:shadow-md transition-shadow bg-white group">
                        <div className="flex justify-between items-start mb-1">
                             <div className="text-xs font-bold text-slate-500 flex flex-col">
                                <span>{new Date(event.date).getDate()}</span>
                                <span className="text-[10px] uppercase font-normal">{new Date(event.date).toLocaleString('en-US', { weekday: 'short' })}</span>
                             </div>
                             <Badge type={event.type} />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 mb-0.5">{event.title}</h4>
                        {event.endDate && event.endDate !== event.date && (
                             <div className="text-[10px] text-slate-400 mb-1">
                                Until {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                             </div>
                        )}
                        <p className="text-xs text-slate-500 line-clamp-2">{event.description}</p>
                    </div>
                ))}
                {monthEvents.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        No events for this month.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};