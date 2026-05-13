const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        // Data to seed
        const usersToSeed = [
            {
                name: 'Admin',
                phone: '9999999999',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'Student',
                phone: '8888888888',
                password: 'user123',
                role: 'customer',
                address: 'SRKR Engineering College',
                pinCode: '534204',
                landmark: 'Near Library',
                hostelBlock: 'Block A'
            },
            {
                name: 'Ravi Kumar',
                phone: '7777777771',
                password: 'delivery123',
                role: 'delivery_boy'
            },
            {
                name: 'Suresh Babu',
                phone: '7777777772',
                password: 'delivery123',
                role: 'delivery_boy'
            },
            {
                name: 'Kiran Kumar',
                phone: '7777777773',
                password: 'delivery123',
                role: 'delivery_boy'
            }
        ];

        for (const userData of usersToSeed) {
            const userExists = await User.findOne({ phone: userData.phone });
            if (!userExists) {
                const user = new User(userData);
                await user.save();
                console.log(`Created ${userData.role}: ${userData.name} (${userData.phone})`);
            } else {
                console.log(`User already exists: ${userData.name} (${userData.phone})`);
            }
        }

        console.log('Database seeding completed');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
