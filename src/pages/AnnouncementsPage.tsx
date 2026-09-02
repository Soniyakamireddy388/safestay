import React, { useState, useEffect } from 'react';
import { announcementService } from '../services/apiServices';
import { Announcement, AnnouncementCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Megaphone, Plus, Calendar, User, ShieldAlert, Sparkles, X } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<AnnouncementCategory>('General');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await announcementService.createAnnouncement({
        title,
        content,
        category,
        author: user?.name || 'Soniya Kamireddy',
        targetAudience: 'ALL',
      });

      showToast('Announcement Published', 'Circular broadcasted to all residents.', 'success');
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      loadAnnouncements();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = announcements.filter((a) => {
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Hostel Announcements & Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official communications from Super Administrator Soniya Kamireddy and Senior Warden Ramesh Chandra.
          </p>
        </div>

        {(user?.role === 'ADMIN' || user?.role === 'WARDEN') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Broadcast New Notice</span>
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'General', 'Safety', 'Maintenance', 'Event', 'Emergency'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.category === 'Emergency'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : item.category === 'Safety'
                      ? 'bg-teal-100 text-teal-800 border border-teal-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif] mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {item.author}
              </span>
              <span className="font-semibold text-slate-400 uppercase text-[10px]">Audience: {item.targetAudience}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Outfit',sans-serif]">Publish Hostel Notice</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="General">General</option>
                  <option value="Safety">Safety</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Event">Event</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Circular Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Wi-Fi maintenance this Saturday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Content:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write notice details for residents and parents..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-all"
                >
                  {isSubmitting ? 'Broadcasting...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
