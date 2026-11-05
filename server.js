
const dns = require('node:dns');

// Use Google DNS for MongoDB SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const app = require('./src/app');
const connectToDB = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

startServer();
