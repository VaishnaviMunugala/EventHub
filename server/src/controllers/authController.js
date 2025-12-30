const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('Registering user:', email);

        // Check if user exists
        const { data: userExists, error: checkError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        // PGRST116 means no rows found (success for registration)
        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Check User Error:', checkError);
            // Don't throw immediately, maybe table doesn't exist?
            return res.status(500).json({ message: 'Database Check Failed: ' + checkError.message });
        }

        if (userExists) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const { data: user, error: createError } = await supabase
            .from('users')
            .insert([{
                name,
                email,
                password: hashedPassword,
                role: 'user'
            }])
            .select()
            .single();

        if (createError) {
            console.error('Create User Error:', createError);
            return res.status(500).json({ message: 'Registration Failed: ' + createError.message });
        }

        if (user) {
            console.log('User created:', user.id);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
                registeredEvents: [],
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Exception:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (user && (await bcrypt.compare(password, user.password))) {
            // Get registered events (IDs)
            const { data: regs } = await supabase
                .from('registrations')
                .select('event_id')
                .eq('user_id', user.id);

            const registeredEvents = regs ? regs.map(r => r.event_id) : [];

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
                registeredEvents: registeredEvents,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { registerUser, loginUser };
