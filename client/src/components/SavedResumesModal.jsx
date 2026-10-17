import React, { useState, useEffect } from 'react';
import { X, FileText, Trash2, Plus, Clock, Loader2, Check } from 'lucide-react';
import { api } from '../services/api';
import { BLANK_RESUME, SANJAY_RESUME } from '../constants/initialData';

export default function SavedResumesModal({ isOpen, onClose, onSelectResume, activeResumeId }) {
  if (!isOpen) return null;

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const list = await api.getAllResumes();
      setResumes(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    setDeletingId(id);
    try {
      await api.deleteResume(id);
      setResumes(prev => prev.filter(r => (r._id || r.id) !== id));
    } catch (err) {
      alert('Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateNew = () => {
    onSelectResume({ ...BLANK_RESUME, _id: null, title: 'New Resume ' + new Date().toLocaleDateString() });
    onClose();
  };

  const handleLoadSample = () => {
    onSelectResume({ ...SANJAY_RESUME, _id: null, title: 'Sanjay Francis A - Full Stack Web Developer' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Your Saved Resumes</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleCreateNew}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Blank
            </button>
            <button
              onClick={handleLoadSample}
              className="flex items-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              Load Sample Template
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
              <span className="text-xs">Loading resumes...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium">No saved resumes found in database.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Create New" or save your current resume to view it here.</p>
            </div>
          ) : (
            resumes.map(r => {
              const id = r._id || r.id;
              const isActive = id === activeResumeId;

              return (
                <div
                  key={id}
                  onClick={() => {
                    onSelectResume(r);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:text-indigo-600'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {r.title || r.personalInfo?.fullName || 'Untitled Resume'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {r.personalInfo?.jobTitle || r.targetJobTitle || 'No title set'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Last updated: {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                    <button
                      onClick={(e) => handleDelete(id, e)}
                      disabled={deletingId === id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Resume"
                    >
                      {deletingId === id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
