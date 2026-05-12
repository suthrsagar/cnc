require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    let MONGO_URL = process.env.MONGO_URL;
    MONGO_URL = MONGO_URL.replace(/^"|"/g, '').trim();
    await mongoose.connect(MONGO_URL);

    const email = 'sutharsagar710@gmail.com';
    let adminUser = await User.findOne({ email });

    if (!adminUser) {
      adminUser = new User({
        name: 'Sagar Suthar (Admin)',
        email: email,
        phone: '0000000000',
        password: '12344321', // Handled by pre-save hook
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin account created successfully!');
    } else {
      adminUser.role = 'admin';
      adminUser.password = '12344321';
      await adminUser.save();
      console.log('Admin account already exists, password updated!');
    }
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
