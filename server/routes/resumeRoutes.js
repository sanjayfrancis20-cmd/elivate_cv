import express from 'express';
import { storageService } from '../services/storage.js';

const router = express.Router();

// GET all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await storageService.getAllResumes();
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resumes', error: error.message });
  }
});

// GET single resume by id
router.get('/:id', async (req, res) => {
  try {
    const resume = await storageService.getResumeById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resume', error: error.message });
  }
});

// POST create resume
router.post('/', async (req, res) => {
  try {
    const resume = await storageService.createResume(req.body);
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(400).json({ success: false, message: 'Failed to save resume', error: error.message });
  }
});

// PUT update resume
router.put('/:id', async (req, res) => {
  try {
    const updated = await storageService.updateResume(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(400).json({ success: false, message: 'Failed to update resume', error: error.message });
  }
});

// DELETE resume
router.delete('/:id', async (req, res) => {
  try {
    const success = await storageService.deleteResume(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resume', error: error.message });
  }
});

export default router;
