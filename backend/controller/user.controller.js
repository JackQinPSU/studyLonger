require("dotenv/config");
const prisma = require("../src/prisma");
const bcrypt = require("bcrypt");

//create a new user
const createNewUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return  res.status(400).json({ error: 'Email and Password are required' });
        };
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash
            }});
        return res.status(201).json({newUser});
        } catch (error) {
            return res.status(400).json({
                name: error.name,
                message: error.message,
            });
    }
};

//show all users
const showAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json({users});
    } catch (error) {
        res.json({error});
    }
};

module.exports = {
    createNewUser,
    showAllUsers
};