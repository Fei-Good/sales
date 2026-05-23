module.exports = {
    port: Number(process.env.PORT) || 80,
    session: {
        secret: process.env.SESSION_SECRET || 'dev-only-change-session-secret',
        key: process.env.SESSION_KEY || 'tiger',
        maxAge: Number(process.env.SESSION_MAX_AGE) || 2592000000
    },
    mongodb: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sales'
};
