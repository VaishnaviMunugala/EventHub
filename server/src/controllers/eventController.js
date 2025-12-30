const supabase = require('../config/supabase');

// Helper to map snake_case to camelCase for frontend compatibility
const mapEvent = (e) => ({
    _id: e.id, // Shim _id
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    venue: e.venue,
    maxParticipants: e.max_participants,
    registeredCount: e.registered_count,
    status: e.status,
    createdAt: e.created_at
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const now = new Date().toISOString();

        // Auto-update statuses (simplistic check)
        // Supabase doesn't have "updateMany" with complex queries directly in one go like Mongoose sometimes.
        // We can run updates.
        await supabase.from('events')
            .update({ status: 'upcoming' })
            .gt('date', now)
            .neq('status', 'upcoming');

        await supabase.from('events')
            .update({ status: 'completed' })
            .lte('date', now)
            .neq('status', 'completed');

        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;

        res.json(events.map(mapEvent));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const { data: event, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(mapEvent(event));
    } catch (error) {
        res.status(404).json({ message: 'Event not found' });
    }
};

// @desc    Create a event
// @route   POST /api/admin/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, venue, maxParticipants } = req.body;

        const { data: event, error } = await supabase
            .from('events')
            .insert([{
                title,
                description,
                date,
                time,
                venue,
                max_participants: maxParticipants,
                registered_count: 0,
                status: 'upcoming'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(mapEvent(event));
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid event data' });
    }
};

// @desc    Delete a event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    try {
        const updates = {};
        if (req.body.title) updates.title = req.body.title;
        if (req.body.description) updates.description = req.body.description;
        if (req.body.date) updates.date = req.body.date;
        if (req.body.time) updates.time = req.body.time;
        if (req.body.venue) updates.venue = req.body.venue;
        if (req.body.maxParticipants) updates.max_participants = req.body.maxParticipants;
        if (req.body.status) updates.status = req.body.status;
        updates.updated_at = new Date();

        const { data: event, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(mapEvent(event));
    } catch (error) {
        res.status(400).json({ message: 'Invalid event data' });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    deleteEvent,
    updateEvent,
};
