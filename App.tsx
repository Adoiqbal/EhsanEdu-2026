import React, { useState, useEffect } from 'react';
import { CalendarEvent } from './types';
import { getEvents, saveEvent, deleteEvent, bulkImportEvents } from './services/storageService';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { SchoolLogo } from './components/SchoolLogo';
import { LayoutDashboard, Calendar, Settings, User, Lock } from 'lucide-react';

type View = 'dashboard' | 'calendar' | 'admin';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleAddEvent = (newEvent: CalendarEvent) => {
    const updated = saveEvent(newEvent);
    setEvents(updated);
  };

  const handleImportEvents = (newEvents: CalendarEvent[]) => {
    const updated = bulkImportEvents(newEvents);
    setEvents(updated);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = deleteEvent(id);
    setEvents(updated);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard events={events} />;
      case 'calendar':
        return <CalendarView events={events} />;
      case 'admin':
        if (isAuthenticated) {
          return (
            <AdminPanel 
              events={events} 
              onAddEvent={handleAddEvent} 
              onImportEvents={handleImportEvents}
              onDeleteEvent={handleDeleteEvent}
            />
          );
        }
        return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
      default:
        return <Dashboard events={events} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-16 lg:w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col transition-all duration-300 sticky top-0 h-screen z-30">
        <div className="h-16 lg:h-24 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800 gap-3">
             <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 p-0.5 ring-2 ring-blue-500/50">
               <SchoolLogo className="w-full h-full" />
            </div>
            <div className="hidden lg:block">
                <h1 className="font-bold text-sm leading-tight tracking-tight text-white">Sekolah Rendah Islam<br/>Integrasi Ehsan</h1>
                <p className="text-xs text-slate-400 mt-1">Sistem Takwim 2026</p>
            </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-2 lg:px-3">
            <NavItem 
                active={currentView === 'dashboard'} 
                onClick={() => setCurrentView('dashboard')} 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
            />
            <NavItem 
                active={currentView === 'calendar'} 
                onClick={() => setCurrentView('calendar')} 
                icon={<Calendar size={20} />} 
                label="Takwim Sekolah" 
            />
            <NavItem 
                active={currentView === 'admin'} 
                onClick={() => setCurrentView('admin')} 
                icon={isAuthenticated ? <Settings size={20} /> : <Lock size={20} />} 
                label="Pentadbiran" 
            />
        </nav>

        <div className="p-4 border-t border-slate-800 hidden lg:block">
            <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAuthenticated ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'}`}>
                   {isAuthenticated ? <Settings size={14} /> : <User size={14} />}
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Pengguna Semasa</p>
                  <p className="text-sm font-semibold text-white">
                    {isAuthenticated ? 'Admin' : 'Tetamu / Ibu Bapa'}
                  </p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 lg:px-8 flex items-center justify-between shadow-sm">
            <div>
                <h1 className="text-lg lg:text-2xl font-bold text-slate-800 capitalize flex items-center gap-2">
                    {currentView === 'admin' ? 'Pentadbiran' : (currentView === 'calendar' ? 'Takwim Sekolah' : 'Dashboard')}
                    {currentView === 'admin' && !isAuthenticated && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full border border-slate-200">Locked</span>}
                </h1>
                <p className="text-xs lg:text-sm text-slate-500 hidden sm:block">Tahun Akademik 2026</p>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-600 border border-slate-200 hidden sm:inline-block">
                    {new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold border ${isAuthenticated ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {isAuthenticated ? 'A' : 'T'}
                </div>
            </div>
        </header>

        <div className="p-3 lg:p-8 max-w-[1600px] mx-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group justify-center lg:justify-start
            ${active 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }
        `}
    >
        <div className={`flex items-center justify-center ${active ? 'text-white' : 'text-current'}`}>
            {icon}
        </div>
        <span className="hidden lg:block ml-3 font-medium text-sm">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block"></div>}
    </button>
);

export default App;