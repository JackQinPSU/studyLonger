require("dotenv/config");
const prisma = require("../src/prisma");

// Create a new session
const createNewSession = async (req, res) => {
    try {
        const {subject} = req.body;
        if (!subject) {
            return res.status(400).json({ error: 'Subject is required' });
        }
        const userId = req.user.id;
        if (typeof subject !== 'string') {
            return res.status(400).json({ error: 'Invalid data types for Subject' });
        }
        const newSession = await prisma.session.create({
            data: {
                subject,
                userId
            }});
        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({error});
    }
};

const endSession = async (req, res) => {
    try {
        const sessionId = Number(req.params.sessionId);
        if (sessionId == null){
            return res.status(400).json({ error: 'Session ID is required' });
        };
        if (typeof sessionId !== 'number') {
            return res.status(400).json({ error: 'Invalid Session ID' });
        };
        const updated = await prisma.session.update({
            where: { id: sessionId,
                     endTime: null,
            },
            data: { endTime: new Date() }
        });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to end session' });
    }
};

const listSessions = async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            where: { userId: req.user.id },
            orderBy: { startTime: 'desc' },
            take: 200,
        });
        res.status(200).json( {sessions} );
    } catch  (error) {
        res.status(500).json({error});
    }
};
module.exports = {
    createNewSession,
    endSession,
    listSessions
};