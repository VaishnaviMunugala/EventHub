const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const isDemo = !supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project');

if (isDemo) {
    console.warn('⚠️  RUNNING IN DEMO MODE (In-Memory Database) ⚠️');
}

// Realistic event names
const eventNames = [
    { title: 'Tech Innovation Summit 2025', desc: 'Join industry leaders discussing the future of technology and innovation.' },
    { title: 'AI & Machine Learning Workshop', desc: 'Hands-on workshop covering latest ML algorithms and practical applications.' },
    { title: 'Web Development Bootcamp', desc: 'Intensive training on modern web technologies including React, Node.js, and more.' },
    { title: 'Cybersecurity Awareness Seminar', desc: 'Learn about latest security threats and how to protect your digital assets.' },
    { title: 'Startup Pitch Competition', desc: 'Aspiring entrepreneurs present their ideas to investors and industry experts.' },
    { title: 'Digital Marketing Masterclass', desc: 'Master SEO, social media marketing, and content strategy for business growth.' },
    { title: 'Cloud Computing Conference', desc: 'Explore AWS, Azure, and Google Cloud platforms with hands-on demos.' },
    { title: 'Data Science Symposium', desc: 'Deep dive into data analytics, visualization, and predictive modeling.' },
    { title: 'Mobile App Development Workshop', desc: 'Build cross-platform mobile apps using React Native and Flutter.' },
    { title: 'Blockchain & Cryptocurrency Forum', desc: 'Understanding blockchain technology and its real-world applications.' },
    { title: 'UX/UI Design Thinking Workshop', desc: 'Learn user-centered design principles and create stunning interfaces.' },
    { title: 'DevOps Best Practices Summit', desc: 'CI/CD, containerization, and automation strategies for modern development.' },
    { title: 'Product Management Bootcamp', desc: 'From ideation to launch - complete product lifecycle management.' },
    { title: 'Python Programming Intensive', desc: 'Master Python for data science, automation, and web development.' },
    { title: 'Agile & Scrum Certification', desc: 'Get certified in Agile methodologies and Scrum framework.' },
    { title: 'IoT Innovation Expo', desc: 'Discover Internet of Things applications in smart cities and industries.' },
    { title: 'Game Development Conference', desc: 'Unity, Unreal Engine, and indie game development insights.' },
    { title: 'Robotics & Automation Fair', desc: 'Latest in robotics, automation, and industrial AI applications.' },
    { title: 'Green Tech & Sustainability Summit', desc: 'Technology solutions for environmental challenges and sustainability.' },
    { title: 'FinTech Revolution Conference', desc: 'Digital banking, payment systems, and financial technology trends.' }
];

// --- MOCK DATA GENERATOR ---
const generateEvents = () => {
    const events = [];
    const now = Date.now();
    const day = 86400000;

    // 5 Completed Events
    for (let i = 0; i < 5; i++) {
        const eventData = eventNames[i];
        events.push({
            id: `completed_${i + 1}`,
            title: eventData.title,
            description: eventData.desc,
            date: new Date(now - ((i + 1) * day)).toISOString(),
            time: '10:00 AM',
            venue: i % 2 === 0 ? 'Main Auditorium' : 'Virtual Event',
            max_participants: 100,
            registered_count: 100,
            status: 'completed',
            created_at: new Date(now - ((i + 2) * day)).toISOString()
        });
    }

    // 15 Upcoming Events (reduced from 45 to 20 total as requested)
    for (let i = 0; i < 15; i++) {
        const eventData = eventNames[5 + i];
        events.push({
            id: `upcoming_${i + 1}`,
            title: eventData.title,
            description: eventData.desc,
            date: new Date(now + ((i + 1) * day)).toISOString(),
            time: i % 3 === 0 ? '9:00 AM' : i % 3 === 1 ? '2:00 PM' : '6:00 PM',
            venue: i % 2 === 0 ? 'Tech Hub Conference Center' : 'Online Platform',
            max_participants: 50 + (i * 10),
            registered_count: Math.floor(Math.random() * 30),
            status: 'upcoming',
            created_at: new Date().toISOString()
        });
    }
    return events;
};

// --- MOCK DATABASE ---
const db = {
    users: [],
    events: generateEvents(),
    registrations: []
};

// Seed an admin and a user
(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedAdmin = await bcrypt.hash('admin123', salt);
    const hashedUser = await bcrypt.hash('password123', salt);

    db.users.push({
        id: 'admin_id',
        name: 'Admin User',
        email: 'admin@eventhub.com',
        password: hashedAdmin,
        role: 'admin',
        created_at: new Date().toISOString()
    });

    db.users.push({
        id: 'user_id',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedUser,
        role: 'user',
        created_at: new Date().toISOString()
    });
})();

// --- MOCK CLIENT ---
class MockQueryBuilder {
    constructor(table, data) {
        this.table = table;
        this.data = [...(data || [])];
        this.error = null;
        this.isSingle = false;
        this.selectCalled = false;
    }

    select(columns, options) {
        this.selectCalled = true;
        if (options && options.count) this.count = this.data.length;
        if (this.table === 'registrations' && typeof columns === 'string') {
            if (columns.includes('events')) {
                this.data = this.data.map(r => ({
                    ...r,
                    events: db.events.find(e => e.id === r.event_id)
                }));
            }
            if (columns.includes('users')) {
                this.data = this.data.map(r => ({
                    ...r,
                    users: db.users.find(u => u.id === r.user_id)
                }));
            }
        }
        return this;
    }

    insert(rows) {
        const newRows = rows.map(r => ({
            ...r,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString()
        }));
        if (this.table && db[this.table]) {
            db[this.table].push(...newRows);
        }
        this.data = newRows;
        return this;
    }

    update(updates) {
        this.pendingUpdate = updates;
        return this;
    }

    delete() {
        this.pendingDelete = true;
        return this;
    }

    eq(col, val) {
        this.data = this.data.filter(item => item[col] == val);
        return this;
    }

    gt(col, val) { this.data = this.data.filter(item => item[col] > val); return this; }
    gte(col, val) { this.data = this.data.filter(item => item[col] >= val); return this; }
    lt(col, val) { this.data = this.data.filter(item => item[col] < val); return this; }
    lte(col, val) { this.data = this.data.filter(item => item[col] <= val); return this; }
    neq(col, val) { this.data = this.data.filter(item => item[col] != val); return this; }

    order(col, { ascending = true } = {}) {
        this.data.sort((a, b) => {
            const vA = new Date(a[col]).getTime() || a[col];
            const vB = new Date(b[col]).getTime() || b[col];
            if (vA < vB) return ascending ? -1 : 1;
            if (vA > vB) return ascending ? 1 : -1;
            return 0;
        });
        return this;
    }

    single() {
        this.isSingle = true;
        return this;
    }

    async then(resolve, reject) {
        if (this.pendingUpdate) {
            this.data.forEach(item => {
                const dbItem = db[this.table]?.find(i => i.id === item.id);
                if (dbItem) Object.assign(dbItem, this.pendingUpdate);
                Object.assign(item, this.pendingUpdate);
            });
        }
        if (this.pendingDelete) {
            this.data.forEach(item => {
                const idx = db[this.table]?.findIndex(i => i.id === item.id);
                if (idx > -1) db[this.table].splice(idx, 1);
            });
            this.data = null;
        }

        if (this.isSingle) {
            if (this.data.length === 0) {
                resolve({ data: null, error: { code: 'PGRST116', message: 'Row not found' } });
            } else {
                resolve({ data: this.data[0], error: null });
            }
        } else {
            resolve({ data: this.data, error: null, count: this.count });
        }
    }
}

const mockClient = {
    from: (table) => {
        if (!db[table]) db[table] = [];
        return new MockQueryBuilder(table, db[table]);
    }
};

module.exports = isDemo ? mockClient : createClient(supabaseUrl, supabaseKey);
