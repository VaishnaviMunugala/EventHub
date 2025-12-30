const supabase = require('../config/supabase');

// @desc    Get analytics overview
// @route   GET /api/admin/analytics/overview
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        // Safe fetch with error handling
        const fetchCount = async (table, query = {}) => {
            let builder = supabase.from(table).select('*', { count: 'exact', head: true });
            if (query.role) builder = builder.eq('role', query.role);

            const { count, error } = await builder;
            if (error) {
                console.error(`Error fetching count for ${table}:`, error.message);
                return 0; // Default to 0 on error
            }
            return count || 0;
        };

        const totalEvents = await fetchCount('events');
        const totalRegistrations = await fetchCount('registrations');
        const totalUsers = await fetchCount('users', { role: 'user' });

        // Event stats
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('title, registered_count, max_participants, date');

        if (eventsError) throw eventsError;

        const eventStats = (events || []).map(e => ({
            title: e.title,
            registeredCount: e.registered_count || 0,
            maxParticipants: e.max_participants || 0,
            date: e.date
        }));

        // Registration trends
        const { data: allRegs, error: regsError } = await supabase
            .from('registrations')
            .select('registered_at');

        if (regsError) throw regsError;

        const trendsMap = {};
        (allRegs || []).forEach(r => {
            if (r.registered_at) {
                const date = new Date(r.registered_at).toISOString().split('T')[0];
                trendsMap[date] = (trendsMap[date] || 0) + 1;
            }
        });

        const registrationTrends = Object.keys(trendsMap).sort().map(date => ({
            _id: date,
            count: trendsMap[date]
        }));

        res.json({
            totalEvents,
            totalRegistrations,
            totalUsers,
            eventStats,
            registrationTrends
        });
    } catch (error) {
        console.error("Admin Analytics Error:", error);
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
};

// @desc    Get all registrations for specific event (for attendance)
// @route   GET /api/admin/events/:id/registrations
// @access  Private/Admin
const getEventRegistrations = async (req, res) => {
    try {
        const { data: regs, error } = await supabase
            .from('registrations')
            .select('*, users(name, email)')
            .eq('event_id', req.params.id);

        if (error) throw error;

        // Map structure to flattened format expected by frontend
        const mapped = regs.map(r => ({
            _id: r.id,
            attendanceStatus: r.attendance_status,
            mobile: r.mobile, // Added
            name: r.name, // Added override name
            registeredAt: r.registered_at,
            userId: {
                _id: r.users?.id,
                name: r.users?.name,
                email: r.users?.email
            }
        }));

        res.json(mapped);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc    Mark attendance
// @route   PUT /api/admin/registrations/:id/attendance
// @access  Private/Admin
const markAttendance = async (req, res) => {
    try {
        const { status } = req.body;
        const { data: reg, error } = await supabase
            .from('registrations')
            .update({ attendance_status: status })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !reg) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        res.json({
            _id: reg.id,
            attendanceStatus: reg.attendance_status
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc    Get all users (for admin view)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('name, email, role')
            .eq('role', 'user');

        if (error) throw error;
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAnalytics, getEventRegistrations, markAttendance, getUsers };
