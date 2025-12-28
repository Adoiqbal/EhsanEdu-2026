import React, { useState } from 'react';
import { CalendarEvent, EventType } from '../types';
import { generateScheduleSuggestions } from '../services/geminiService';
import { Plus, Wand2, Loader2, Save, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onImportEvents: (events: CalendarEvent[]) => void;
  onDeleteEvent: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ events, onAddEvent, onImportEvents, onDeleteEvent }) => {
  // Manual Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<EventType>(EventType.KURIKULUM);
  const [description, setDescription] = useState('');

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<CalendarEvent[] | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent({
      id: Math.random().toString(36).substr(2, 9),
      title,
      date,
      endDate: endDate || undefined,
      type,
      description
    });
    // Reset
    setTitle('');
    setDescription('');
    setEndDate('');
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    setGeneratedPreview(null);
    try {
      const suggestions = await generateScheduleSuggestions(aiPrompt);
      setGeneratedPreview(suggestions);
    } catch (error) {
      alert("Failed to generate events. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmImport = () => {
    if (generatedPreview) {
      onImportEvents(generatedPreview);
      setGeneratedPreview(null);
      setAiPrompt('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Left Column: Manual Entry & AI Assistant */}
      <div className="space-y-8">
        
        {/* Manual Entry */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" /> Tambah Aktiviti
          </h3>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Aktiviti</label>
              <input 
                type="text" 
                required 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="cth: Mesyuarat PIBG"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarikh Mula</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  min="2026-01-01"
                  max="2026-12-31"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarikh Tamat (Pilihan)</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                  min={date || "2026-01-01"}
                  max="2026-12-31"
                />
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={type}
                  onChange={e => setType(e.target.value as EventType)}
                >
                  {Object.values(EventType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
              Tambah Aktiviti
            </button>
          </form>
        </div>

        {/* AI Generator */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" /> AI Scheduler Assistant
          </h3>
          <p className="text-sm text-purple-700 mb-4">
            Berikan arahan (cth: "Senaraikan cuti umum Malaysia bagi tahun 2026 dan tandakan sebagai Cuti")
          </p>
          <div className="space-y-3">
             <textarea 
                className="w-full px-3 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white/80"
                rows={3}
                placeholder="Cth: Buat jadual peperiksaan akhir tahun pada bulan November..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
              ></textarea>
              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2 rounded-lg transition-colors shadow-sm"
              >
                {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                {isGenerating ? "Menjana..." : "Jana Jadual"}
              </button>
          </div>

          {generatedPreview && (
            <div className="mt-6 bg-white rounded-lg p-4 border border-purple-100 shadow-sm animate-fade-in">
              <h4 className="text-sm font-bold text-purple-900 mb-2">Pratonton ({generatedPreview.length} aktiviti)</h4>
              <ul className="text-xs space-y-2 max-h-40 overflow-y-auto mb-4">
                {generatedPreview.map((e, i) => (
                  <li key={i} className="flex justify-between text-slate-600">
                    <span>{e.date} - <b>{e.title}</b></span>
                    <span className="text-purple-500">{e.type}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={confirmImport} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm font-medium">
                  Sahkan & Import
                </button>
                <button onClick={() => setGeneratedPreview(null)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 rounded text-sm font-medium">
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Manage Existing List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Senarai Aktiviti</h3>
            <span className="text-sm text-slate-500">{events.length} entri</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-xs uppercase text-slate-500 bg-slate-50">
                        <th className="p-3">Tarikh</th>
                        <th className="p-3">Aktiviti</th>
                        <th className="p-3 text-right">Tindakan</th>
                    </tr>
                </thead>
                <tbody>
                    {events.sort((a,b) => a.date.localeCompare(b.date)).map(event => (
                        <tr key={event.id} className="border-b border-slate-50 hover:bg-slate-50 group">
                            <td className="p-3 text-sm font-mono text-slate-600 whitespace-nowrap">
                                {event.date}
                                {event.endDate && <div className="text-[10px] text-slate-400">hingga {event.endDate}</div>}
                            </td>
                            <td className="p-3">
                                <div className="text-sm font-medium text-slate-800">{event.title}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                        event.type === EventType.CUTI ? 'bg-red-100 text-red-700' :
                                        event.type === EventType.KURIKULUM ? 'bg-blue-100 text-blue-700' :
                                        event.type === EventType.HEM ? 'bg-orange-100 text-orange-700' :
                                        event.type === EventType.KOKO ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {event.type}
                                    </span>
                                </div>
                            </td>
                            <td className="p-3 text-right">
                                <button 
                                    onClick={() => onDeleteEvent(event.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
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