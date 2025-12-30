const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); // Need to export 'admin' middleware properly
const { createEvent, deleteEvent, updateEvent } = require('../controllers/eventController');
const { getAnalytics, getEventRegistrations, markAttendance, getUsers } = require('../controllers/adminController');
const { admin: adminMiddleware } = require('../middleware/adminMiddleware');

// Event Management
router.post('/events', protect, adminMiddleware, createEvent);
router.put('/events/:id', protect, adminMiddleware, updateEvent);
router.delete('/events/:id', protect, adminMiddleware, deleteEvent);

// Analytics
router.get('/analytics/overview', protect, adminMiddleware, getAnalytics);
router.get('/users', protect, adminMiddleware, getUsers);

// Attendance / Registrations for event
router.get('/events/:id/registrations', protect, adminMiddleware, getEventRegistrations);
router.put('/registrations/:id/attendance', protect, adminMiddleware, markAttendance);

module.exports = router;
