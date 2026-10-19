export function getDefaultApiBase() {
  if (typeof window !== 'undefined') {
    // When running Vite dev server, '/api' is proxied to backend seamlessly for any device
    if (window.location.port === '5173') {
      return '/api';
    }
    // If not proxied, connect to port 5000 of the same host machine
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
}

export function getApiBaseUrl() {
  const custom = localStorage.getItem('elevate_api_base');
  // Avoid broken localhost references when accessed from mobile or other network devices
  if (custom && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (custom.includes('localhost:5000')) {
      return '/api';
    }
  }
  return custom || getDefaultApiBase();
}

export function setApiBaseUrl(url) {
  localStorage.setItem('elevate_api_base', url);
}

export function getCustomApiKey() {
  return localStorage.getItem('elevate_openai_key') || '';
}

export function setCustomApiKey(key) {
  localStorage.setItem('elevate_openai_key', key);
}

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const key = getCustomApiKey();
  if (key) {
    headers['x-openai-key'] = key;
  }
  return headers;
};

export const api = {
  async checkStatus() {
    try {
      const res = await fetch(`${getApiBaseUrl()}/status`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Status check failed');
      return await res.json();
    } catch (err) {
      return {
        status: 'offline',
        database: { status: 'disconnected', mode: 'Local Browser Storage' },
        openai: { serverKeyConfigured: false }
      };
    }
  },

  async getAllResumes() {
    try {
      const res = await fetch(`${getApiBaseUrl()}/resumes`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch resumes');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('API error fetching resumes, loading from local backup:', err);
      const local = localStorage.getItem('elevate_resumes_backup');
      return local ? JSON.parse(local) : [];
    }
  },

  async getResume(id) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/resumes/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch resume');
      const data = await res.json();
      return data.data;
    } catch (err) {
      const local = localStorage.getItem('elevate_resumes_backup');
      if (local) {
        const list = JSON.parse(local);
        return list.find(r => r._id === id || r.id === id);
      }
      return null;
    }
  },

  async saveResume(resume) {
    try {
      const id = resume._id || resume.id;
      let res;
      if (id && id.length > 5) {
        res = await fetch(`${getApiBaseUrl()}/resumes/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(resume)
        });
      } else {
        res = await fetch(`${getApiBaseUrl()}/resumes`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(resume)
        });
      }

      if (!res.ok) throw new Error('Failed to save resume');
      const data = await res.json();
      this.syncLocalBackup(data.data);
      return data.data;
    } catch (err) {
      console.warn('Server save failed, saving to local backup:', err);
      const savedDoc = {
        ...resume,
        _id: resume._id || 'local_' + Date.now(),
        updatedAt: new Date().toISOString()
      };
      this.syncLocalBackup(savedDoc);
      return savedDoc;
    }
  },

  async deleteResume(id) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/resumes/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete resume');
    } catch (err) {
      console.warn('Server delete failed, deleting from local backup:', err);
    }
    const local = localStorage.getItem('elevate_resumes_backup');
    if (local) {
      const list = JSON.parse(local).filter(r => r._id !== id && r.id !== id);
      localStorage.setItem('elevate_resumes_backup', JSON.stringify(list));
    }
    return true;
  },

  syncLocalBackup(doc) {
    try {
      const local = localStorage.getItem('elevate_resumes_backup');
      const list = local ? JSON.parse(local) : [];
      const idx = list.findIndex(r => r._id === doc._id);
      if (idx >= 0) {
        list[idx] = doc;
      } else {
        list.unshift(doc);
      }
      localStorage.setItem('elevate_resumes_backup', JSON.stringify(list));
      localStorage.setItem('elevate_active_resume', JSON.stringify(doc));
    } catch (e) {
      console.error('Error syncing local backup:', e);
    }
  },

  async requestAiSuggestion(payload) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/ai/suggest`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('AI request failed');
      return await res.json();
    } catch (err) {
      console.error('AI suggestion API call failed:', err);
      throw err;
    }
  }
};
