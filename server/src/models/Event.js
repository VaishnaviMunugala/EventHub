const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    maxParticipants: {
        type: Number,
        required: true,
    },
    registeredCount: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming',
    },
}, {
    timestamps: true,
});

// Middleware to update status based on date could be added here or scheduled, 
// for now we'll handle status dynamically or via admin updates if needed, 
// but the prompt asks for auto-marking. 
// A simple virtual or check on retrieval is often best, but for storage we keep it simple.
// Let's stick to the prompt fields.
// "Event Status Handling: Events automatically marked as..." -> suggests derived state or cron.
// We can update status on fetch.

module.exports = mongoose.model('Event', eventSchema);
