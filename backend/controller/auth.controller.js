require("dotenv/config");
const bcrypt = require("bcrypt");
const prisma = require("../src/prisma");
const crypto = require("crypto");

// Login user
const loginUser = async (req, res) => {
    try {
        const { email,  password } = req.body;
        
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
        };
        const passwordMatch = await bcrypt.compare(req.body.password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        //Create auth session
        const token = crypto.randomBytes(32).toString("hex");

        //Date of expiration: 7 days from now
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const authSession = await prisma.authSession.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            },
        });

        // Set cookie
        res.cookie("sessionToken", authSession.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
        });
        res.status(200).json({ message: 'Login successful', userId: user.id });

    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = {
    loginUser
};
