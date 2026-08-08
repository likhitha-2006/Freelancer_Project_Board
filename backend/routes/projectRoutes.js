const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router
  .route('/')
  .get(getProjects)
  .post(protect, authorize('client', 'admin'), upload.array('attachments', 5), createProject);

router
  .route('/:id')
  .get(getProjectById)
  .put(protect, upload.array('attachments', 5), updateProject)
  .delete(protect, deleteProject);

module.exports = router;
