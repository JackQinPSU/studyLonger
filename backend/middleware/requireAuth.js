const prisma = require('../src/prisma');

const requireAuth = async (req, res, next) => {
    try {// Read token from cookie 
    const token = req.cookies.sessionToken;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    };

    // Lookup session in DB
    const authSession = await prisma.authSession.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!authSession) {
        return res.status(401).json({ error: 'Invalid session' });
    };

    // check expiration and clean up
    if (authSession.expiresAt < new Date()) {
        await prisma.authSession.delete({ where: { token } });
        return res.status(401).json({ error: 'Session expired' });
    };

    // Attach user to request object
    req.user = {
        id: authSession.user.id,
        email: authSession.user.email
    };

    next();} catch (error) {
        res.status(500).json({ error: 'Authentication check failed' });
    };
};

module.exports = requireAuth;