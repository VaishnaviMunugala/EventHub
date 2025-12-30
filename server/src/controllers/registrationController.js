const supabase = require('../config/supabase');

// Helper to map registration
const mapReg = (r) => ({
    _id: r.id,
    userId: r.user_id,
    eventId: r.event_id, // If populated, special handling needed
    attendanceStatus: r.attendance_status,
    registeredAt: r.registered_at,
    // Populate event details if joined
    ...(r.events && {
        eventId: {
            _id: r.events.id,
            id: r.events.id,
            title: r.events.title,
            date: r.events.date,
            time: r.events.time,
            venue: r.events.venue,
            status: r.events.status
        }
    })
});

// @desc    Register for an event
// @route   POST /api/register/:eventId
// @access  Private
const registerForEvent = async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    try {
        // 1. Get event details to check limits
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (!event || eventError) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.registered_count >= event.max_participants) {
            return res.status(400).json({ message: 'Event is full' });
        }

        // 2. Check if already registered
        const { data: existing } = await supabase
            .from('registrations')
            .select('id')
            .eq('user_id', userId)
            .eq('event_id', eventId)
            .single();

        if (existing) {
            return res.status(400).json({ message: 'Already registered' });
        }

        // 3. Register
        const { mobile, name } = req.body;

        const { data: reg, error: regError } = await supabase
            .from('registrations')
            .insert([{
                user_id: userId,
                event_id: eventId,
                mobile: mobile, // Store mobile
                name: name      // Store name
            }])
            .select()
            .single();

        if (regError) throw regError;

        // 4. Update event count
        await supabase
            .from('events')
            .update({ registered_count: event.registered_count + 1 })
            .eq('id', eventId);

        res.status(201).json(mapReg(reg));
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Registration failed: ' + (error.message || error) });
    }
};

// @desc    Get user registrations
// @route   GET /api/registrations/user
// @access  Private
const getUserRegistrations = async (req, res) => {
    try {
        // Join with events table
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('*, events(*)')
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json(registrations.map(mapReg));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel registration
// @route   DELETE /api/register/:id
// @access  Private
const cancelRegistration = async (req, res) => {
    try {
        // Check ownership
        const { data: reg, error: findError } = await supabase
            .from('registrations')
            .select('user_id, event_id')
            .eq('id', req.params.id)
            .single();

        if (!reg || findError) return res.status(404).json({ message: 'Registration not found' });

        if (reg.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete
        await supabase.from('registrations').delete().eq('id', req.params.id);

        // Decrement event count
        const { data: event } = await supabase.from('events').select('registered_count').eq('id', reg.event_id).single();
        if (event) {
            await supabase.from('events').update({ registered_count: Math.max(0, event.registered_count - 1) }).eq('id', reg.event_id);
        }

        res.json({ message: 'Registration cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerForEvent, getUserRegistrations, cancelRegistration };
