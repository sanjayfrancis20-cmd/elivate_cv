import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Resume } from '../models/Resume.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'resumes.json');

async function ensureLocalDb() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(LOCAL_DB_FILE);
    } catch {
      await fs.writeFile(LOCAL_DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing local data file:', err);
  }
}

async function readLocalResumes() {
  await ensureLocalDb();
  try {
    const data = await fs.readFile(LOCAL_DB_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Failed to read local resumes:', err);
    return [];
  }
}

async function writeLocalResumes(resumes) {
  await ensureLocalDb();
  await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(resumes, null, 2), 'utf-8');
}

export const storageService = {
  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  },

  async getAllResumes() {
    if (this.isMongoConnected()) {
      return await Resume.find().sort({ updatedAt: -1 });
    }
    const local = await readLocalResumes();
    return local.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  },

  async getResumeById(id) {
    if (this.isMongoConnected()) {
      try {
        const found = await Resume.findById(id);
        if (found) return found;
      } catch (e) {
        // ID might not be a valid ObjectId, search fallback
      }
    }
    const local = await readLocalResumes();
    return local.find(r => r._id === id || r.id === id) || null;
  },

  async createResume(data) {
    const now = new Date().toISOString();
    if (this.isMongoConnected()) {
      const newResume = new Resume(data);
      return await newResume.save();
    }
    const local = await readLocalResumes();
    const newDoc = {
      ...data,
      _id: crypto.randomBytes(12).toString('hex'),
      createdAt: now,
      updatedAt: now
    };
    local.push(newDoc);
    await writeLocalResumes(local);
    return newDoc;
  },

  async updateResume(id, data) {
    const now = new Date().toISOString();
    if (this.isMongoConnected()) {
      try {
        const updated = await Resume.findByIdAndUpdate(id, { ...data, updatedAt: now }, { new: true, runValidators: true });
        if (updated) return updated;
      } catch (e) {
        // Fallback to local if not found
      }
    }
    const local = await readLocalResumes();
    const index = local.findIndex(r => r._id === id || r.id === id);
    if (index === -1) {
      // Create if doesn't exist
      const newDoc = {
        ...data,
        _id: id || crypto.randomBytes(12).toString('hex'),
        createdAt: now,
        updatedAt: now
      };
      local.push(newDoc);
      await writeLocalResumes(local);
      return newDoc;
    }
    local[index] = {
      ...local[index],
      ...data,
      _id: local[index]._id,
      updatedAt: now
    };
    await writeLocalResumes(local);
    return local[index];
  },

  async deleteResume(id) {
    if (this.isMongoConnected()) {
      try {
        const deleted = await Resume.findByIdAndDelete(id);
        if (deleted) return true;
      } catch (e) {
        // Fallback
      }
    }
    const local = await readLocalResumes();
    const filtered = local.filter(r => r._id !== id && r.id !== id);
    const deleted = filtered.length !== local.length;
    await writeLocalResumes(filtered);
    return deleted;
  }
};
