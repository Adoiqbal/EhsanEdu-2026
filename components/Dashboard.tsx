import React, { useMemo } from 'react';
import { CalendarEvent, EventType } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calendar as CalendarIcon, Flag, BookOpen, Coffee, Award, Users, Briefcase, Moon } from 'lucide-react';

interface DashboardProps {
  events: CalendarEvent[];
}

const COLORS = ['#ef4444', '#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#64748b'];

export const Dashboard: React.FC<DashboardProps> = ({ events }) => {
  
  const stats = useMemo(() => {
    return {
      total: events.length,
      cuti: events.filter(e => e.type === EventType.CUTI).length,
      kurikulum: events.filter(e => e.type === EventType.KURIKULUM).length,
      hem: events.filter(e => e.type === EventType.HEM).length,
      koko: events.filter(e => e.type === EventType.KOKO).length,
      diniah: events.filter(e => e.type === EventType.DINIAH).length,
      pentadbiran: events.filter(e => e.type === EventType.PENTADBIRAN).length,
    };
  }, [events]);

  const typeData = useMemo(() => [
    { name: 'Cuti', value: stats.cuti },
    { name: 'Kurikulum', value: stats.kurikulum },
    { name: 'HEM', value: stats.hem },
    { name: 'Koko', value: stats.koko },
    { name: 'Diniah', value: stats.diniah },
    { name: 'Pentadbiran', value: stats.pentadbiran },
  ].filter(d => d.value > 0), [stats]);

  const monthlyData = useMemo(() => {
    const months = Array(12).fill(0).map((_, i) => ({ 
      name: new Date(2026, i, 1).toLocaleString('ms-MY', { month: 'short' }), 
      events: 0 
    }));
    
    events.forEach(e => {
      const month = new Date(e.date).getMonth();
      if (month >= 0 && month < 12) {
        months[month].events++;
      }
    });
    return months;
  }, [events]);

  const upcomingEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);
  }, [events]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<Coffee className="w-5 h-5 text-red-600" />} label="Cuti" value={stats.cuti} color="bg-red-50" />
        <StatCard icon={<BookOpen className="w-5 h-5 text-blue-600" />} label="Kurikulum" value={stats.kurikulum} color="bg-blue-50" />
        <StatCard icon={<Users className="w-5 h-5 text-orange-600" />} label="HEM" value={stats.hem} color="bg-orange-50" />
        <StatCard icon={<Flag className="w-5 h-5 text-emerald-600" />} label="Koko" value={stats.koko} color="bg-emerald-50" />
        <StatCard icon={<Moon className="w-5 h-5 text-purple-600" />} label="Diniah" value={stats.diniah} color="bg-purple-50" />
        <StatCard icon={<Briefcase className="w-5 h-5 text-slate-600" />} label="Pentadbiran" value={stats.pentadbiran} color="bg-slate-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Taburan Aktiviti</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 mt-2">
             {typeData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{entry.name}</span>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Beban Bulanan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="events" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Aktiviti Akan Datang</h3>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Takwim 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="py-3 font-medium">Tarikh</th>
                <th className="py-3 font-medium">Acara</th>
                <th className="py-3 font-medium">Kategori</th>
                <th className="py-3 font-medium text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((event) => (
                <tr key={event.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 text-sm text-slate-600 font-medium">
                    {new Date(event.date).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short' })}
                    {event.endDate && event.endDate !== event.date && (
                        ` - ${new Date(event.endDate).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short' })}`
                    )}
                  </td>
                  <td className="py-3">
                    <div className="text-sm font-medium text-slate-800">{event.title}</div>
                    <div className="text-xs text-slate-500">{event.description}</div>
                  </td>
                  <td className="py-3">
                    <Badge type={event.type} />
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Lihat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => (
  <div className={`p-4 rounded-xl border border-slate-100 shadow-sm bg-white flex items-center space-x-3`}>
    <div className={`p-2 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export const Badge = ({ type }: { type: EventType }) => {
  const styles = {
    [EventType.CUTI]: 'bg-red-100 text-red-700 border border-red-200',
    [EventType.KURIKULUM]: 'bg-blue-100 text-blue-700 border border-blue-200',
    [EventType.HEM]: 'bg-orange-100 text-orange-700 border border-orange-200',
    [EventType.KOKO]: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    [EventType.DINIAH]: 'bg-purple-100 text-purple-700 border border-purple-200',
    [EventType.PENTADBIRAN]: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {type}
    </span>
  );
};