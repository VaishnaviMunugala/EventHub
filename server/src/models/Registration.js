const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    attendanceStatus: {
        type: String,
        enum: ['registered', 'attended', 'absent', 'cancelled'],
        default: 'registered',
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Only if we want update tracking, but registeredAt covers creation
});

// Compound index to prevent duplicate registration at DB level
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
