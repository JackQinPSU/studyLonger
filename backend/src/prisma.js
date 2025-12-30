require("dotenv/config");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// 1) Read your Postgres connection string from .env
const connectionString = process.env.DATABASE_URL;

// 2) Create the driver adapter Prisma 7 "client engine" requires
const adapter = new PrismaPg({ connectionString });

// 3) Create the Prisma client using the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;