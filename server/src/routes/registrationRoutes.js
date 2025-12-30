const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerForEvent, getUserRegistrations, cancelRegistration } = require('../controllers/registrationController');

router.get('/user', protect, getUserRegistrations);
router.post('/:eventId', protect, registerForEvent);
router.delete('/:id', protect, cancelRegistration); // :id is registration ID

module.exports = router;
